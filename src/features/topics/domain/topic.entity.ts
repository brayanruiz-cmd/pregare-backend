import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TopicPractice } from './topic-practice.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ length: 50 })
  tag: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, nullable: true })
  subtitle: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'scripture_quote', type: 'text', nullable: true })
  scriptureQuote: string;

  @Column({ name: 'scripture_reference', length: 100, nullable: true })
  scriptureReference: string;

  @Column({ name: 'video_duration_minutes', default: 8 })
  videoDurationMinutes: number;

  @Column({ name: 'youtube_query', length: 255, default: '' })
  youtubeQuery: string;

  @Column({ name: 'youtube_url', type: 'varchar', length: 500, nullable: true })
  youtubeUrl: string | null;

  @Column({ name: 'youtube_video_id', type: 'varchar', length: 100, nullable: true })
  youtubeVideoId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => TopicPractice, (tp) => tp.topic, { eager: true })
  practices: TopicPractice[];
}
