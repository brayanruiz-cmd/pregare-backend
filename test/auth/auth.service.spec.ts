import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from '../../src/features/auth/application/auth.service';
import { User } from '../../src/features/auth/domain/user.entity';
import { RefreshToken } from '../../src/features/auth/domain/refresh-token.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let refreshRepo: jest.Mocked<Repository<RefreshToken>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUserRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    const mockRefreshRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-access-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshRepo,
        },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    refreshRepo = module.get(getRepositoryToken(RefreshToken));
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('creates a new user and returns tokens', async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
      } as any);
      userRepo.save.mockResolvedValue({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
      } as any);
      refreshRepo.create.mockReturnValue({ id: '1' } as any);
      refreshRepo.save.mockResolvedValue({ id: '1' } as any);

      const result = await service.register(
        'Test',
        'test@test.com',
        'Password1',
      );

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@test.com');
      expect(userRepo.save).toHaveBeenCalled();
    });

    it('throws ConflictException if email already exists', async () => {
      userRepo.findOne.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
      } as any);

      await expect(
        service.register('Test', 'test@test.com', 'Password1'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('returns tokens for valid credentials', async () => {
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash('Password1', 12);
      userRepo.findOne.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        passwordHash: hash,
      } as any);
      refreshRepo.create.mockReturnValue({ id: '1' } as any);
      refreshRepo.save.mockResolvedValue({ id: '1' } as any);

      const result = await service.login('test@test.com', 'Password1');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('throws UnauthorizedException for invalid credentials', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.login('test@test.com', 'WrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('returns new tokens for valid refresh token', async () => {
      const crypto = require('crypto');
      const token = 'valid-token';
      const hash = crypto.createHash('sha256').update(token).digest('hex');

      refreshRepo.findOne.mockResolvedValue({
        id: '1',
        tokenHash: hash,
        userId: '1',
        expiresAt: new Date(Date.now() + 86400000),
      } as any);
      userRepo.findOne.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
      } as any);
      refreshRepo.delete.mockResolvedValue({} as any);
      refreshRepo.create.mockReturnValue({ id: '2' } as any);
      refreshRepo.save.mockResolvedValue({ id: '2' } as any);

      const result = await service.refreshToken(token);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('throws UnauthorizedException for expired token', async () => {
      refreshRepo.findOne.mockResolvedValue({
        id: '1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() - 86400000),
      } as any);

      await expect(service.refreshToken('expired')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
