import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibleService } from './bible.service';
import { BibleController } from './bible.controller';
import { UserHighlight } from '../streaks/domain/user-highlight.entity';
import { VerseCollection } from './domain/verse-collection.entity';
import { VerseCollectionItem } from './domain/verse-collection-item.entity';
import { VerseHighlightStat } from './domain/verse-highlight-stat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserHighlight,
      VerseCollection,
      VerseCollectionItem,
      VerseHighlightStat,
    ]),
  ],
  controllers: [BibleController],
  providers: [BibleService],
  exports: [BibleService],
})
export class BibleModule {}
