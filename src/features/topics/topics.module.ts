import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { Topic } from './domain/topic.entity';
import { TopicPractice } from './domain/topic-practice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, TopicPractice])],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService, TypeOrmModule],
})
export class TopicsModule {}
