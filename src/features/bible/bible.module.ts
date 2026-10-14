import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibleService } from './bible.service';
import { BibleController } from './bible.controller';
import { UserHighlight } from '../streaks/domain/user-highlight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserHighlight])],
  controllers: [BibleController],
  providers: [BibleService],
  exports: [BibleService],
})
export class BibleModule {}
