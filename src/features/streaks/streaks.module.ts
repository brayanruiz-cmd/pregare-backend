import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreaksService } from './streaks.service';
import { StreaksController } from './streaks.controller';
import { Streak } from './domain/streak.entity';
import { StreakActivityLog } from './domain/streak-activity-log.entity';
import { UserSavedDeclaration } from './domain/user-saved-declaration.entity';
import { UserCompletedDevotional } from './domain/user-completed-devotional.entity';
import { UserHighlight } from './domain/user-highlight.entity';
import { UserBadge } from './domain/user-badge.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Streak,
      StreakActivityLog,
      UserSavedDeclaration,
      UserCompletedDevotional,
      UserHighlight,
      UserBadge,
    ]),
    AuthModule,
  ],
  controllers: [StreaksController],
  providers: [StreaksService],
  exports: [StreaksService, TypeOrmModule],
})
export class StreaksModule {}
