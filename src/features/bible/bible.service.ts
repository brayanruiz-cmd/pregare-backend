import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserHighlight } from '../streaks/domain/user-highlight.entity';
import { VerseCollection } from './domain/verse-collection.entity';
import { VerseCollectionItem } from './domain/verse-collection-item.entity';

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

export interface BibleBook {
  id: string;
  name: string;
  testament: 'OT' | 'NT';
  chapters: number;
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

const BIBLE_VERSIONS: BibleVersion[] = [
  {
    id: 'KJV',
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'en',
  },
  {
    id: 'RVR1960',
    name: 'Reina-Valera 1960',
    abbreviation: 'RVR1960',
    language: 'es',
  },
];

const BIBLE_BOOKS: BibleBook[] = [
  { id: 'genesis', name: 'Genesis', testament: 'OT', chapters: 50 },
  { id: 'exodus', name: 'Exodus', testament: 'OT', chapters: 40 },
  { id: 'leviticus', name: 'Leviticus', testament: 'OT', chapters: 27 },
  { id: 'numbers', name: 'Numbers', testament: 'OT', chapters: 36 },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'OT', chapters: 34 },
  { id: 'joshua', name: 'Joshua', testament: 'OT', chapters: 24 },
  { id: 'judges', name: 'Judges', testament: 'OT', chapters: 21 },
  { id: 'ruth', name: 'Ruth', testament: 'OT', chapters: 4 },
  { id: '1samuel', name: '1 Samuel', testament: 'OT', chapters: 31 },
  { id: '2samuel', name: '2 Samuel', testament: 'OT', chapters: 24 },
  { id: '1kings', name: '1 Kings', testament: 'OT', chapters: 22 },
  { id: '2kings', name: '2 Kings', testament: 'OT', chapters: 25 },
  { id: '1chronicles', name: '1 Chronicles', testament: 'OT', chapters: 29 },
  { id: '2chronicles', name: '2 Chronicles', testament: 'OT', chapters: 36 },
  { id: 'ezra', name: 'Ezra', testament: 'OT', chapters: 10 },
  { id: 'nehemiah', name: 'Nehemiah', testament: 'OT', chapters: 13 },
  { id: 'esther', name: 'Esther', testament: 'OT', chapters: 10 },
  { id: 'job', name: 'Job', testament: 'OT', chapters: 42 },
  { id: 'psalms', name: 'Psalms', testament: 'OT', chapters: 150 },
  { id: 'proverbs', name: 'Proverbs', testament: 'OT', chapters: 31 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'OT', chapters: 12 },
  { id: 'songofsolomon', name: 'Song of Solomon', testament: 'OT', chapters: 8 },
  { id: 'isaiah', name: 'Isaiah', testament: 'OT', chapters: 66 },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'OT', chapters: 52 },
  { id: 'lamentations', name: 'Lamentations', testament: 'OT', chapters: 5 },
  { id: 'ezekiel', name: 'Ezekiel', testament: 'OT', chapters: 48 },
  { id: 'daniel', name: 'Daniel', testament: 'OT', chapters: 12 },
  { id: 'hosea', name: 'Hosea', testament: 'OT', chapters: 14 },
  { id: 'joel', name: 'Joel', testament: 'OT', chapters: 3 },
  { id: 'amos', name: 'Amos', testament: 'OT', chapters: 9 },
  { id: 'obadiah', name: 'Obadiah', testament: 'OT', chapters: 1 },
  { id: 'jonah', name: 'Jonah', testament: 'OT', chapters: 4 },
  { id: 'micah', name: 'Micah', testament: 'OT', chapters: 7 },
  { id: 'nahum', name: 'Nahum', testament: 'OT', chapters: 3 },
  { id: 'habakkuk', name: 'Habakkuk', testament: 'OT', chapters: 3 },
  { id: 'zephaniah', name: 'Zephaniah', testament: 'OT', chapters: 3 },
  { id: 'haggai', name: 'Haggai', testament: 'OT', chapters: 2 },
  { id: 'zechariah', name: 'Zechariah', testament: 'OT', chapters: 14 },
  { id: 'malachi', name: 'Malachi', testament: 'OT', chapters: 4 },
  { id: 'matthew', name: 'Matthew', testament: 'NT', chapters: 28 },
  { id: 'mark', name: 'Mark', testament: 'NT', chapters: 16 },
  { id: 'luke', name: 'Luke', testament: 'NT', chapters: 24 },
  { id: 'john', name: 'John', testament: 'NT', chapters: 21 },
  { id: 'acts', name: 'Acts', testament: 'NT', chapters: 28 },
  { id: 'romans', name: 'Romans', testament: 'NT', chapters: 16 },
  { id: '1corinthians', name: '1 Corinthians', testament: 'NT', chapters: 16 },
  { id: '2corinthians', name: '2 Corinthians', testament: 'NT', chapters: 13 },
  { id: 'galatians', name: 'Galatians', testament: 'NT', chapters: 6 },
  { id: 'ephesians', name: 'Ephesians', testament: 'NT', chapters: 6 },
  { id: 'philippians', name: 'Philippians', testament: 'NT', chapters: 4 },
  { id: 'colossians', name: 'Colossians', testament: 'NT', chapters: 4 },
  {
    id: '1thessalonians',
    name: '1 Thessalonians',
    testament: 'NT',
    chapters: 5,
  },
  {
    id: '2thessalonians',
    name: '2 Thessalonians',
    testament: 'NT',
    chapters: 3,
  },
  { id: '1timothy', name: '1 Timothy', testament: 'NT', chapters: 6 },
  { id: '2timothy', name: '2 Timothy', testament: 'NT', chapters: 4 },
  { id: 'titus', name: 'Titus', testament: 'NT', chapters: 3 },
  { id: 'philemon', name: 'Philemon', testament: 'NT', chapters: 1 },
  { id: 'hebrews', name: 'Hebrews', testament: 'NT', chapters: 13 },
  { id: 'james', name: 'James', testament: 'NT', chapters: 5 },
  { id: '1peter', name: '1 Peter', testament: 'NT', chapters: 5 },
  { id: '2peter', name: '2 Peter', testament: 'NT', chapters: 3 },
  { id: '1john', name: '1 John', testament: 'NT', chapters: 5 },
  { id: '2john', name: '2 John', testament: 'NT', chapters: 1 },
  { id: '3john', name: '3 John', testament: 'NT', chapters: 1 },
  { id: 'jude', name: 'Jude', testament: 'NT', chapters: 1 },
  { id: 'revelation', name: 'Revelation', testament: 'NT', chapters: 22 },
];

const BOOK_ALIASES: Record<string, string> = {
  exodo: 'exodus',
  levitico: 'leviticus',
  numeros: 'numbers',
  deuteronomio: 'deuteronomy',
  josue: 'joshua',
  jueces: 'judges',
  rut: 'ruth',
  '1reyes': '1kings',
  '2reyes': '2kings',
  '1cronicas': '1chronicles',
  '2cronicas': '2chronicles',
  nehemias: 'nehemiah',
  salmos: 'psalms',
  proverbios: 'proverbs',
  eclesiastes: 'ecclesiastes',
  cantares: 'songofsolomon',
  isaias: 'isaiah',
  jeremias: 'jeremiah',
  lamentaciones: 'lamentations',
  ezequiel: 'ezekiel',
  oseas: 'hosea',
  abdias: 'obadiah',
  jonas: 'jonah',
  miqueas: 'micah',
  habacuc: 'habakkuk',
  sofonias: 'zephaniah',
  hageo: 'haggai',
  zacarias: 'zechariah',
  malaquias: 'malachi',
  mateo: 'matthew',
  marcos: 'mark',
  lucas: 'luke',
  juan: 'john',
  hechos: 'acts',
  romanos: 'romans',
  '1corintios': '1corinthians',
  '2corintios': '2corinthians',
  galatas: 'galatians',
  efesios: 'ephesians',
  filipenses: 'philippians',
  colosenses: 'colossians',
  '1tesalonicenses': '1thessalonians',
  '2tesalonicenses': '2thessalonians',
  '1timoteo': '1timothy',
  '2timoteo': '2timothy',
  filemon: 'philemon',
  hebreos: 'hebrews',
  santiago: 'james',
  '1pedro': '1peter',
  '2pedro': '2peter',
  '1juan': '1john',
  '2juan': '2john',
  '3juan': '3john',
  apocalipsis: 'revelation',
};

function normalizeBookId(idOrName: string): string {
  const clean = idOrName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
  return BOOK_ALIASES[clean] || clean;
}

const VERSION_MAP: Record<string, string> = {
  RVR1960: 'RV1960',
  RV1960: 'RV1960',
  NVI: 'NVI',
  KJV: 'KJV',
  NIV: 'NIV',
  ESV: 'ESV',
  LBLA: 'LBLA',
  NTV: 'NTV',
};

@Injectable()
export class BibleService {
  private readonly logger = new Logger(BibleService.name);
  private readonly cache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

  constructor(
    private config: ConfigService,
    @Optional()
    @InjectRepository(UserHighlight)
    private readonly highlightRepo?: Repository<UserHighlight>,
    @Optional()
    @InjectRepository(VerseCollection)
    private readonly collectionRepo?: Repository<VerseCollection>,
    @Optional()
    @InjectRepository(VerseCollectionItem)
    private readonly collectionItemRepo?: Repository<VerseCollectionItem>,
  ) {}

  async getHighlights(userId: string): Promise<UserHighlight[]> {
    if (!this.highlightRepo) return [];
    return this.highlightRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async toggleHighlight(
    userId: string,
    data: {
      bookId: string;
      chapter: number;
      verseNumber: number;
      verseText: string;
      version?: string;
      colorHex?: string;
    },
  ): Promise<{ highlighted: boolean; highlight?: UserHighlight }> {
    if (!this.highlightRepo) return { highlighted: false };

    const existing = await this.highlightRepo.findOne({
      where: {
        userId,
        bookId: data.bookId.toLowerCase(),
        chapter: data.chapter,
        verseNumber: data.verseNumber,
      },
    });

    if (existing) {
      // If user selected a different color, update the existing highlight
      if (
        data.colorHex &&
        data.colorHex.toUpperCase() !== existing.colorHex.toUpperCase()
      ) {
        existing.colorHex = data.colorHex;
        if (data.verseText) existing.verseText = data.verseText;
        if (data.version) existing.version = data.version;
        const updated = await this.highlightRepo.save(existing);
        return { highlighted: true, highlight: updated };
      }

      // If same color or explicitly removed, delete it
      await this.highlightRepo.delete(existing.id);
      return { highlighted: false };
    }

    const highlight = this.highlightRepo.create({
      userId,
      bookId: data.bookId.toLowerCase(),
      chapter: data.chapter,
      verseNumber: data.verseNumber,
      verseText: data.verseText || '',
      version: data.version || 'RVR1960',
      colorHex: data.colorHex || '#F7EBD2',
    });
    const saved = await this.highlightRepo.save(highlight);
    return { highlighted: true, highlight: saved };
  }

  // ── Verse Collections ──────────────────────────────────────────────────
  async getCollections(userId: string): Promise<any[]> {
    if (!this.collectionRepo) return [];
    const collections = await this.collectionRepo.find({
      where: { userId },
      relations: { items: true },
      order: { updatedAt: 'DESC' },
    });

    return collections.map((col) => ({
      id: col.id,
      userId: col.userId,
      title: col.title,
      description: col.description,
      colorHex: col.colorHex,
      isPrivate: col.isPrivate,
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
      itemsCount: col.items?.length || 0,
      previewVerses: (col.items || []).slice(0, 3).map((item) => ({
        id: item.id,
        bookId: item.bookId,
        bookName: item.bookName,
        chapter: item.chapter,
        verseNumber: item.verseNumber,
        verseText: item.verseText,
        colorHex: item.colorHex,
      })),
    }));
  }

  async createCollection(
    userId: string,
    data: { title: string; description?: string; colorHex?: string },
  ): Promise<VerseCollection> {
    if (!this.collectionRepo) {
      throw new Error('Database not initialized');
    }
    const collection = this.collectionRepo.create({
      userId,
      title: data.title.trim(),
      description: data.description?.trim(),
      colorHex: data.colorHex || '#B58D3D',
      isPrivate: true,
    });
    return this.collectionRepo.save(collection);
  }

  async getCollection(
    userId: string,
    collectionId: string,
  ): Promise<VerseCollection | null> {
    if (!this.collectionRepo) return null;
    return this.collectionRepo.findOne({
      where: { id: collectionId, userId },
      relations: { items: true },
      order: {
        items: {
          createdAt: 'DESC',
        },
      },
    });
  }

  async deleteCollection(userId: string, collectionId: string): Promise<boolean> {
    if (!this.collectionRepo) return false;
    const res = await this.collectionRepo.delete({ id: collectionId, userId });
    return (res.affected || 0) > 0;
  }

  async getVerseCollectionIds(
    userId: string,
    bookId: string,
    chapter: number,
    verseNumber: number,
  ): Promise<string[]> {
    if (!this.collectionItemRepo) return [];
    const items = await this.collectionItemRepo.find({
      where: {
        userId,
        bookId: bookId.toLowerCase(),
        chapter,
        verseNumber,
      },
      select: { collectionId: true },
    });
    return items.map((i) => i.collectionId);
  }

  async toggleVerseInCollection(
    userId: string,
    collectionId: string,
    data: {
      bookId: string;
      bookName?: string;
      chapter: number;
      verseNumber: number;
      verseText: string;
      version?: string;
      colorHex?: string;
    },
  ): Promise<{ inCollection: boolean; item?: VerseCollectionItem }> {
    if (!this.collectionRepo || !this.collectionItemRepo) {
      throw new Error('Database not initialized');
    }

    const collection = await this.collectionRepo.findOne({
      where: { id: collectionId, userId },
    });
    if (!collection) {
      throw new Error('Colección no encontrada');
    }

    const existing = await this.collectionItemRepo.findOne({
      where: {
        collectionId,
        userId,
        bookId: data.bookId.toLowerCase(),
        chapter: data.chapter,
        verseNumber: data.verseNumber,
      },
    });

    if (existing) {
      await this.collectionItemRepo.delete(existing.id);
      collection.updatedAt = new Date();
      await this.collectionRepo.save(collection);
      return { inCollection: false };
    }

    const newItem = this.collectionItemRepo.create({
      collectionId,
      userId,
      bookId: data.bookId.toLowerCase(),
      bookName: data.bookName || data.bookId,
      chapter: data.chapter,
      verseNumber: data.verseNumber,
      verseText: data.verseText || '',
      version: data.version || 'RVR1960',
      colorHex: data.colorHex || '#F7EBD2',
    });

    const saved = await this.collectionItemRepo.save(newItem);
    collection.updatedAt = new Date();
    await this.collectionRepo.save(collection);
    return { inCollection: true, item: saved };
  }

  getVersions(): BibleVersion[] {
    return BIBLE_VERSIONS;
  }

  getBooks(version: string): BibleBook[] {
    return BIBLE_BOOKS;
  }

  async getChapter(
    book: string,
    chapter: number,
    version: string = 'RVR1960',
  ): Promise<BibleChapter> {
    const cacheKey = `${version}:${book}:${chapter}`;
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    const normalizedBookId = normalizeBookId(book);
    const bookIndex = BIBLE_BOOKS.findIndex(
      (b) => b.id === normalizedBookId || normalizeBookId(b.name) === normalizedBookId,
    );
    if (bookIndex === -1) {
      throw new Error(`Book not found: ${book}`);
    }

    const bookData = BIBLE_BOOKS[bookIndex];
    if (chapter < 1 || chapter > bookData.chapters) {
      throw new Error(
        `Chapter ${chapter} out of range for ${bookData.name} (1-${bookData.chapters})`,
      );
    }

    const bollsVersion = VERSION_MAP[version] || 'NIV';
    const bookNumber = bookIndex + 1; // Bolls Bible uses 1-indexed canonical book numbers (1-66)

    try {
      const url = `https://bolls.life/get-chapter/${bollsVersion}/${bookNumber}/${chapter}/`;
      this.logger.log(`Fetching from Bolls API: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Bolls API error: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Empty verse list received from Bolls API');
      }

      const verses: BibleVerse[] = data.map((item: any) => {
        let text = item.text || '';
        // 1. Remove Strong's concordance tags <S>...</S> or <s...>...</s>
        text = text.replace(/<S[^>]*>[\s\S]*?<\/S>/gi, '');
        // 2. Remove footnote / translation notes <sup>...</sup> and <sub>...</sub>
        text = text.replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '');
        text = text.replace(/<sub[^>]*>[\s\S]*?<\/sub>/gi, '');
        // 3. Remove any remaining HTML tags
        text = text.replace(/<[^>]*>?/gm, '');
        // 4. Remove residual Strong's numbers attached to words (e.g. beginning7225 -> beginning)
        text = text.replace(/([A-Za-z])\d{3,5}\b/g, '$1');
        // 5. Remove standalone Strong's numbers (e.g. " 853 ")
        text = text.replace(/\b\d{3,5}\b/g, '');
        // 6. Fix spaces before punctuation e.g. " ," -> ","
        text = text.replace(/\s+([,.;:!?])/g, '$1');
        // 7. Normalize spaces
        text = text.replace(/\s+/g, ' ').trim();

        return {
          number: item.verse,
          text,
        };
      });

      const result: BibleChapter = {
        book,
        chapter,
        verses,
      };

      this.cache.set(cacheKey, {
        data: result,
        expiry: Date.now() + this.CACHE_TTL,
      });

      return result;
    } catch (error) {
      this.logger.error(`Error fetching from Bolls API: ${error.message}`);
      throw new Error(`Failed to fetch chapter from Bible API: ${error.message}`);
    }
  }

  async getVerseByReference(
    reference: string,
    version: string = 'KJV',
  ): Promise<{
    text: string;
    reference: string;
    version: string;
    bookId: string;
    bookName: string;
    chapter: number;
    verseNumber: number;
  } | null> {
    if (!reference) return null;
    const match = reference.trim().match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (!match) return null;
    const rawBook = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const startVerse = parseInt(match[3], 10);
    const endVerse = match[4] ? parseInt(match[4], 10) : startVerse;

    const bookId = normalizeBookId(rawBook);
    const bookData = BIBLE_BOOKS.find(
      (b) => b.id === bookId || normalizeBookId(b.name) === bookId,
    );
    const bookName = bookData ? bookData.name : rawBook;

    try {
      const chapterData = await this.getChapter(bookId, chapter, version);
      const matchingVerses = chapterData.verses.filter(
        (v) => v.number >= startVerse && v.number <= endVerse,
      );
      if (matchingVerses.length > 0) {
        return {
          text: matchingVerses.map((v) => v.text).join(' '),
          reference,
          version,
          bookId,
          bookName,
          chapter,
          verseNumber: startVerse,
        };
      }
    } catch (err: any) {
      this.logger.warn(
        `Could not fetch verse for ${reference} (${version}): ${err?.message || err}`,
      );
    }

    return null;
  }
}
