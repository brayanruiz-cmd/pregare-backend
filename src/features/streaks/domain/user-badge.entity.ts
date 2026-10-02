import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('user_badges')
@Unique(['userId', 'badgeCode'])
export class UserBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'badge_code', type: 'varchar', length: 50 })
  badgeCode: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: '🏆' })
  icon: string;

  @Column({ type: 'varchar', length: 50, default: 'general' })
  category: string;

  @CreateDateColumn({ name: 'unlocked_at' })
  unlockedAt: Date;
}
