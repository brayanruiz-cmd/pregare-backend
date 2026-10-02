import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Declaration } from './declaration.entity';

@Entity('declaration_topics')
export class DeclarationTopic {
  @PrimaryColumn({ name: 'declaration_id' })
  declarationId: string;

  @PrimaryColumn({ name: 'topic_slug', length: 50 })
  topicSlug: string;

  @ManyToOne(() => Declaration, (d) => d.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'declaration_id' })
  declaration: Declaration;
}
