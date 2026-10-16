import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeclarationTopic } from './declaration-topic.entity';

@Entity('declarations')
export class Declaration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'scripture_text', type: 'text' })
  scriptureText: string;

  @Column({ name: 'scripture_reference', length: 100 })
  scriptureReference: string;

  @Column({ name: 'declaration_text', type: 'text' })
  declarationText: string;

  @Column({ length: 50 })
  topic: string;

  @Column({
    type: 'enum',
    enum: ['mujeres', 'hombres', 'todos'],
    default: 'todos',
  })
  gender: 'mujeres' | 'hombres' | 'todos';

  @Column({ name: 'day_number', type: 'int', nullable: true })
  dayNumber?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => DeclarationTopic, (dt) => dt.declaration, { eager: true })
  topics: DeclarationTopic[];
}
