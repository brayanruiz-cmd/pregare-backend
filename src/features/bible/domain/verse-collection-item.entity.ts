import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VerseCollection } from './verse-collection.entity';

@Entity('verse_collection_items')
export class VerseCollectionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'collection_id', type: 'varchar', length: 36 })
  collectionId: string;

  @ManyToOne(() => VerseCollection, (col) => col.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  collection: VerseCollection;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'book_id', length: 50 })
  bookId: string;

  @Column({ name: 'book_name', length: 100, default: '' })
  bookName: string;

  @Column()
  chapter: number;

  @Column({ name: 'verse_number' })
  verseNumber: number;

  @Column({ name: 'verse_text', type: 'text' })
  verseText: string;

  @Column({ default: 'RVR1960', length: 20 })
  version: string;

  @Column({ name: 'color_hex', default: '#F7EBD2', length: 10 })
  colorHex: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
