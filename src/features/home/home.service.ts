import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Declaration } from '../declarations/domain/declaration.entity';
import { Devotional } from '../devotionals/domain/devotional.entity';
import { UserCompletedDevotional } from '../streaks/domain/user-completed-devotional.entity';
import { BibleService } from '../bible/bible.service';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Declaration)
    private readonly declarationRepo: Repository<Declaration>,
    @InjectRepository(Devotional)
    private readonly devotionalRepo: Repository<Devotional>,
    @InjectRepository(UserCompletedDevotional)
    private readonly compDevRepo: Repository<UserCompletedDevotional>,
    private readonly bibleService: BibleService,
  ) {}

  async getDailyVerse() {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Prioritize today's devotional verse so they are 100% harmonized
    const devotionals = await this.devotionalRepo.find({
      order: { dayNumber: 'ASC' },
    });

    if (devotionals && devotionals.length > 0) {
      const index = dayOfYear % devotionals.length;
      const dev = devotionals[index];

      let verseText = dev.verseText || '';
      let bookId: string | undefined;
      let bookName: string | undefined;
      let chapter: number | undefined;
      let verseNumber: number | undefined;

      if (dev.verseReference) {
        try {
          const kjvVerse = await this.bibleService.getVerseByReference(
            dev.verseReference,
            'KJV',
          );
          if (kjvVerse) {
            verseText = kjvVerse.text;
            bookId = kjvVerse.bookId;
            bookName = kjvVerse.bookName;
            chapter = kjvVerse.chapter;
            verseNumber = kjvVerse.verseNumber;
          }
        } catch {}
      }

      if (verseText) {
        verseText = verseText.replace(/^["'“”«»]+|["'“”«»]+$/g, '').trim();
      }

      return {
        verse: {
          text: verseText,
          reference: dev.verseReference,
          version: 'KJV',
          bookId,
          bookName,
          chapter,
          verseNumber,
          devotionalId: dev.id,
          devotionalDay: dev.dayNumber,
          devotionalTitle: dev.title,
        },
        isFavorited: false,
      };
    }

    const declarations = await this.declarationRepo.find({
      order: { createdAt: 'ASC' },
    });

    if (declarations && declarations.length > 0) {
      const index = dayOfYear % declarations.length;
      const dec = declarations[index];
      let verseText = dec.scriptureText || '';
      let bookId: string | undefined;
      let bookName: string | undefined;
      let chapter: number | undefined;
      let verseNumber: number | undefined;

      if (dec.scriptureReference) {
        try {
          const kjvVerse = await this.bibleService.getVerseByReference(
            dec.scriptureReference,
            'KJV',
          );
          if (kjvVerse) {
            verseText = kjvVerse.text;
            bookId = kjvVerse.bookId;
            bookName = kjvVerse.bookName;
            chapter = kjvVerse.chapter;
            verseNumber = kjvVerse.verseNumber;
          }
        } catch {}
      }

      return {
        verse: {
          text: verseText.replace(/^["'“”«»]+|["'“”«»]+$/g, '').trim(),
          reference: dec.scriptureReference,
          version: 'KJV',
          bookId,
          bookName,
          chapter,
          verseNumber,
        },
        isFavorited: false,
      };
    }

    // Safe fallback
    return {
      verse: {
        text: 'The Lord is my shepherd; I shall not want.',
        reference: 'Psalm 23:1',
        version: 'KJV',
        bookId: 'psalms',
        bookName: 'Psalms',
        chapter: 23,
        verseNumber: 1,
      },
      isFavorited: false,
    };
  }

  async getDailyDevotionalSummary(userId?: string) {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const devotionals = await this.devotionalRepo.find({
      order: { dayNumber: 'ASC' },
    });

    if (devotionals && devotionals.length > 0) {
      const index = dayOfYear % devotionals.length;
      const dev = devotionals[index];
      let isCompleted = false;
      if (userId && userId !== 'default') {
        try {
          const completed = await this.compDevRepo.findOne({
            where: [
              { userId, devotionalId: dev.id },
              { userId, devotionalId: String(dev.dayNumber) },
            ],
          });
          isCompleted = !!completed;
        } catch {}
      }
      return {
        id: dev.dayNumber,
        title: dev.title,
        durationMinutes: dev.durationMinutes || 2,
        isCompleted,
      };
    }

    return null;
  }

  getGreeting(name?: string): { greeting: string; emoji: string } {
    const hour = new Date().getHours();
    const suffix =
      name && name.trim() && name.trim() !== 'Hermano'
        ? `, ${name.trim()}`
        : '';
    if (hour >= 5 && hour < 12) {
      return { greeting: `Good morning${suffix}`, emoji: '🌅' };
    } else if (hour >= 12 && hour < 18) {
      return { greeting: `Good afternoon${suffix}`, emoji: '☀️' };
    } else {
      return { greeting: `Good evening${suffix}`, emoji: '🌙' };
    }
  }
}
