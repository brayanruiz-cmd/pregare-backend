import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('streak_activity_logs')
@Unique(['userId', 'activityDate'])
export class StreakActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'activity_date', type: 'date' })
  activityDate: string;

  @Column({ name: 'declarations_read', default: 0 })
  declarationsRead: number;

  @Column({ name: 'chapters_read', default: 0 })
  chaptersRead: number;

  @Column({ name: 'devotional_completed', default: false })
  devotionalCompleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
