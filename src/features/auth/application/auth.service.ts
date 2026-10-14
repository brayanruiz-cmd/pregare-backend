import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../domain/user.entity';
import { RefreshToken } from '../domain/refresh-token.entity';
import { UserPreference } from '../domain/user-preference.entity';
import { RegisterDto } from '../presentation/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
    @InjectRepository(UserPreference)
    private readonly prefRepo: Repository<UserPreference>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con este correo');
    }

    const mappedGender: 'mujeres' | 'hombres' =
      dto.gender === 'male' || dto.gender === 'hombres' ? 'hombres' : 'mujeres';

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      gender: mappedGender,
      provider: 'email',
    });
    const savedUser = await this.userRepo.save(user);

    // Persist user preferences in user_preferences table
    const pref = this.prefRepo.create({
      userId: savedUser.id,
      writtenFor: mappedGender,
      selectedTopics: dto.selectedTopics || ['Faith', 'Strength', 'Peace'],
      notificationTime: dto.notificationTime || '06:15:00',
      timezone: dto.timezone || 'America/Bogota',
      morningNotificationEnabled: true,
      preferredTranslation: 'NIV',
      textSize: 'medium',
      weeklySummaryEnabled: false,
    });
    await this.prefRepo.save(pref);

    return this.generateTokens(savedUser);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    return this.generateTokens(user);
  }

  async googleLogin(idToken: string) {
    let payload: { email: string; name: string; sub: string };
    try {
      const parts = idToken.split('.');
      if (parts.length !== 3) throw new Error();
      payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    } catch {
      throw new BadRequestException('Token de Google inválido');
    }

    let user = await this.userRepo.findOne({
      where: { googleId: payload.sub },
    });

    if (!user) {
      user = await this.userRepo.findOne({
        where: { email: payload.email },
      });
      if (user) {
        user.googleId = payload.sub;
        user.provider = 'google';
        await this.userRepo.save(user);
      } else {
        user = this.userRepo.create({
          name: payload.name,
          email: payload.email,
          googleId: payload.sub,
          provider: 'google',
        });
        await this.userRepo.save(user);

        // Create default preferences for Google user
        const pref = this.prefRepo.create({
          userId: user.id,
          writtenFor: 'mujeres',
          selectedTopics: ['Faith', 'Strength', 'Peace'],
          notificationTime: '06:15:00',
        });
        await this.prefRepo.save(pref);
      }
    }

    return this.generateTokens(user);
  }

  async refreshToken(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const stored = await this.refreshRepo.findOne({
      where: { tokenHash },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const user = await this.userRepo.findOne({
      where: { id: stored.userId },
    });

    await this.refreshRepo.delete(stored.id);

    return this.generateTokens(user!);
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      try {
        const tokenHash = crypto
          .createHash('sha256')
          .update(refreshToken)
          .digest('hex');
        await this.refreshRepo.delete({ tokenHash });
      } catch (_) {}
    }
  }

  async updateGender(userId: string, gender: 'mujeres' | 'hombres') {
    await this.userRepo.update(userId, { gender });
    await this.prefRepo.update(userId, { writtenFor: gender });
  }

  async getPreferences(userId: string) {
    let pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.prefRepo.create({
        userId,
        writtenFor: 'mujeres',
        selectedTopics: ['Faith', 'Strength', 'Peace'],
        notificationTime: '06:15:00',
        timezone: 'America/Bogota',
        morningNotificationEnabled: true,
        preferredTranslation: 'NIV',
        textSize: 'medium',
        weeklySummaryEnabled: false,
      });
      try {
        await this.prefRepo.save(pref);
      } catch {}
    }
    return pref;
  }

  async updatePreferences(userId: string, update: Partial<UserPreference>) {
    let pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.prefRepo.create({ userId, ...update });
    } else {
      Object.assign(pref, update);
    }
    return this.prefRepo.save(pref);
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role || 'user' };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshRepo.save(
      this.refreshRepo.create({
        userId: user.id,
        tokenHash,
        expiresAt,
      }),
    );

    const { passwordHash, ...userWithoutPassword } = user as any;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }
}
