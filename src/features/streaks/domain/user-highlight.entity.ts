import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_highlights')
export class UserHighlight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'book_id', length: 50 })
  bookId: string;

  @Column()
  chapter: number;

  @Column({ name: 'verse_number' })
  verseNumber: number;

  @Column({ name: 'verse_text', type: 'text' })
  verseText: string;

  @Column({ default: 'NIV', length: 20 })
  version: string;

  @Column({ name: 'color_hex', default: '#F7EBD2', length: 10 })
  colorHex: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
