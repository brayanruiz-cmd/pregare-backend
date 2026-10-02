import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_completed_devotionals')
export class UserCompletedDevotional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'devotional_id', type: 'varchar', length: 36 })
  devotionalId: string;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;
}
