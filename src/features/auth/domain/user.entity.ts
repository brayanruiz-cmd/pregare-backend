import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'password_hash',
    nullable: true,
  })
  passwordHash: string;

  @Column({ type: 'enum', enum: ['mujeres', 'hombres'], nullable: true })
  gender: 'mujeres' | 'hombres';

  @Column({ type: 'enum', enum: ['email', 'google'], default: 'email' })
  provider: 'email' | 'google';

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @Column({
    type: 'varchar',
    length: 255,
    name: 'google_id',
    nullable: true,
    unique: true,
  })
  googleId: string;

  @Column({ type: 'text', name: 'fcm_token', nullable: true })
  fcmToken: string;

  @Column({ type: 'boolean', name: 'notification_enabled', default: true })
  notificationEnabled: boolean;

  @Column({ type: 'int', name: 'notification_hour', default: 7 })
  notificationHour: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (token) => token.user, { cascade: true })
  refreshTokens: RefreshToken[];
}
