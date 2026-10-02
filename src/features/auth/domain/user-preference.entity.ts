import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({
    type: 'enum',
    enum: ['mujeres', 'hombres'],
    default: 'mujeres',
    name: 'written_for',
  })
  writtenFor: 'mujeres' | 'hombres';

  @Column({ type: 'json', nullable: true, name: 'selected_topics' })
  selectedTopics: string[];

  @Column({
    type: 'varchar',
    length: 20,
    default: 'NIV',
    name: 'preferred_translation',
  })
  preferredTranslation: string;

  @Column({
    type: 'enum',
    enum: ['small', 'medium', 'large'],
    default: 'medium',
    name: 'text_size',
  })
  textSize: 'small' | 'medium' | 'large';

  @Column({
    type: 'boolean',
    default: true,
    name: 'morning_notification_enabled',
  })
  morningNotificationEnabled: boolean;

  @Column({ type: 'time', default: '06:15:00', name: 'notification_time' })
  notificationTime: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: 'America/Bogota',
    name: 'timezone',
  })
  timezone: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'weekly_summary_enabled',
  })
  weeklySummaryEnabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
