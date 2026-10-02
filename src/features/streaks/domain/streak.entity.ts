import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('streaks')
export class Streak {
  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'current_streak_days', default: 0 })
  currentStreakDays: number;

  @Column({ name: 'longest_streak', default: 0 })
  longestStreak: number;

  @Column({ name: 'total_days_active', default: 0 })
  totalDaysActive: number;

  @Column({ name: 'last_check_in_date', type: 'date', nullable: true })
  lastCheckInDate: string | null;

  @Column({ name: 'declarations_spoken_count', default: 0 })
  declarationsSpokenCount: number;

  @Column({ name: 'chapters_read_count', default: 0 })
  chaptersReadCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
