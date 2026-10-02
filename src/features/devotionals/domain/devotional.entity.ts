import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('devotionals')
export class Devotional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'day_number', unique: true })
  dayNumber: number;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'duration_minutes', default: 2 })
  durationMinutes: number;

  @Column({ name: 'verse_text', type: 'text' })
  verseText: string;

  @Column({ name: 'verse_reference', length: 100 })
  verseReference: string;

  @Column({ name: 'reflection_text', type: 'text' })
  reflectionText: string;

  @Column({ name: 'prayer_text', type: 'text' })
  prayerText: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
