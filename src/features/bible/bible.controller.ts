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

