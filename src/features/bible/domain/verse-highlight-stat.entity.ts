import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('verse_highlight_stats')
export class VerseHighlightStat {
  @PrimaryColumn({ name: 'book_id', length: 50 })
  bookId: string;

  @PrimaryColumn()
  chapter: number;

  @PrimaryColumn({ name: 'verse_number' })
  verseNumber: number;

  @Column({ name: 'highlight_count', default: 0 })
  highlightCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
