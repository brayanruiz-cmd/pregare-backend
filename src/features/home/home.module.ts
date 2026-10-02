import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { Declaration } from '../declarations/domain/declaration.entity';
import { Devotional } from '../devotionals/domain/devotional.entity';
import { UserCompletedDevotional } from '../streaks/domain/user-completed-devotional.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Declaration, Devotional, UserCompletedDevotional]),
    AuthModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}
