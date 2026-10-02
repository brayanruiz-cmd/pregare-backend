import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevotionalsService } from './devotionals.service';
import { DevotionalsController } from './devotionals.controller';
import { Devotional } from './domain/devotional.entity';
import { UserCompletedDevotional } from '../streaks/domain/user-completed-devotional.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Devotional, UserCompletedDevotional]),
    AuthModule,
  ],
  controllers: [DevotionalsController],
  providers: [DevotionalsService],
  exports: [DevotionalsService, TypeOrmModule],
})
export class DevotionalsModule {}
