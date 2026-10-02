import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BibleService } from './bible.service';
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
