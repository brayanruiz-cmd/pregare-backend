import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VerseCollectionItem } from './verse-collection-item.entity';

@Entity('verse_collections')
export class VerseCollection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({ length: 100 })
  title: string;

  @Column({ nullable: true, length: 255 })
  description?: string;

  @Column({ name: 'color_hex', length: 10, default: '#B58D3D' })
  colorHex: string;

  @Column({ name: 'is_private', default: true })
  isPrivate: boolean;

  @OneToMany(() => VerseCollectionItem, (item) => item.collection, {
    cascade: true,
  })
  items: VerseCollectionItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
