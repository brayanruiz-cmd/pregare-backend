import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Topic } from './topic.entity';

@Entity('topic_practices')
export class TopicPractice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'topic_id' })
  topicId: string;

  @Column({ name: 'step_number' })
  stepNumber: number;

  @Column({ name: 'instruction_text', type: 'text' })
  instructionText: string;

  @ManyToOne(() => Topic, (t) => t.practices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;
}
