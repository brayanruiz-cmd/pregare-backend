import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { BibleService } from './bible.service';
import { OptionalJwtAuthGuard } from '../auth/presentation/optional-jwt-auth.guard';
import type { BibleVersion, BibleBook, BibleChapter } from './bible.service';

@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get('versions')
  getVersions() {
    return this.bibleService.getVersions();
  }

  @Get('books')
  getBooks(@Query('version') version: string = 'RVR1960') {
    return this.bibleService.getBooks(version);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('highlights')
  getHighlights(@Req() req: any, @Query('userId') queryUserId?: string) {
    const userId = req.user?.id || queryUserId || req.headers['x-user-id'];
    if (!userId || userId === 'default') {
      return [];
    }
    return this.bibleService.getHighlights(userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('highlights/toggle')
  toggleHighlight(
    @Req() req: any,
    @Body()
    dto: {
      bookId: string;
      chapter: number;
      verseNumber: number;
      verseText: string;
      version?: string;
      colorHex?: string;
      userId?: string;
    },
  ) {
    const userId = req.user?.id || dto.userId || req.headers['x-user-id'];
    if (!userId || userId === 'default') {
      throw new HttpException(
        'Authentication required to save highlights',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.bibleService.toggleHighlight(userId, dto);
  }

  // ── Verse Collections Endpoints ───────────────────────────────────────────
  @UseGuards(OptionalJwtAuthGuard)
  @Get('collections')
  getCollections(@Req() req: any, @Query('userId') queryUserId?: string) {
    const userId = req.user?.id || queryUserId || req.headers['x-user-id'];
    if (!userId || userId === 'default') {
      return [];
    }
    return this.bibleService.getCollections(userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('collections')
  createCollection(
    @Req() req: any,
    @Body()
    dto: {
      title: string;
      description?: string;
      colorHex?: string;
      userId?: string;
    },
  ) {
    const userId = req.user?.id || dto.userId || req.headers['x-user-id'];
    if (!userId || userId === 'default') {
      throw new HttpException(
        'Authentication required to create collections',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!dto.title || !dto.title.trim()) {
      throw new HttpException('Title is required', HttpStatus.BAD_REQUEST);
    }
    return this.bibleService.createCollection(userId, dto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('collections/verse-status')
  getVerseStatus(
    @Req() req: any,
    @Query('bookId') bookId: string,
    @Query('chapter') chapter: string,
    @Query('verseNumber') verseNumber: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = req.user?.id || queryUserId || req.headers['x-user-id'];
    if (!userId || userId === 'default') {
      return [];
    }
    const ch = parseInt(chapter, 10) || 1;
    const vn = parseInt(verseNumber, 10) || 1;
    return this.bibleService.getVerseCollectionIds(userId, bookId, ch, vn);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('collections/:id')
  async getCollection(
    @Req() req: any,
    @Param('id') id: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = req.user?.id || queryUserId || req.headers['x-user-id'];
    if (!userId || userId === 'default') {
      throw new HttpException(
        'Authentication required',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const collection = await this.bibleService.getCollection(userId, id);
    if (!collection) {
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);
    }
    return collection;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete('collections/:id')
  deleteCollection(
    @Req() req: any,
    @Param('id') id: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = req.user?.id || queryUserId || req.headers['x-user-id'];
    if (!userId || userId === 'default') {
      throw new HttpException(
        'Authentication required',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.bibleService.deleteCollection(userId, id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('collections/:id/toggle-verse')
  toggleVerseInCollection(
    @Req() req: any,
    @Param('id') id: string,
    @Body()
    dto: {
      bookId: string;
      bookName?: string;
      chapter: number;
      verseNumber: number;
      verseText: string;
      version?: string;
      colorHex?: string;
      userId?: string;
    },
  ) {
    const userId = req.user?.id || dto.userId || req.headers['x-user-id'];
    if (!userId || userId === 'default') {
      throw new HttpException(
        'Authentication required',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.bibleService.toggleVerseInCollection(userId, id, dto);
  }

  @Get('read/:book/:chapter')
  async getChapter(
    @Param('book') book: string,
    @Param('chapter') chapter: string,
    @Query('version') version: string = 'RVR1960',
  ) {
    const chapterNum = parseInt(chapter, 10);
    if (isNaN(chapterNum) || chapterNum < 1) {
      throw new HttpException('Invalid chapter number', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.bibleService.getChapter(book, chapterNum, version);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}

