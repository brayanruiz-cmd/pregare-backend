import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './application/admin.service';
import { AdminController } from './presentation/admin.controller';
import { Topic } from '../topics/domain/topic.entity';
import { TopicPractice } from '../topics/domain/topic-practice.entity';
import { Devotional } from '../devotionals/domain/devotional.entity';
import { User } from '../auth/domain/user.entity';
import { Streak } from '../streaks/domain/streak.entity';
import { FocusArea } from '../declarations/domain/focus-area.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Topic,
      TopicPractice,
      Devotional,
      User,
      Streak,
      FocusArea,
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
