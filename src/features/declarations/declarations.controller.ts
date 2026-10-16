import { Controller, Get, Query } from '@nestjs/common';
import { DeclarationsService } from './declarations.service';

@Controller('declarations')
export class DeclarationsController {
  constructor(private readonly declarationsService: DeclarationsService) {}

  @Get('today')
  getToday(
    @Query('gender') gender?: string,
    @Query('day') day?: string,
  ) {
    const dayNum = day ? parseInt(day, 10) : undefined;
    return this.declarationsService.getTodayDeclaration(gender, dayNum);
  }

  @Get('daily')
  getDaily(
    @Query('gender') gender?: string,
    @Query('topics') topics?: string,
    @Query('count') count?: string,
  ) {
    const topicList = topics ? topics.split(',') : undefined;
    const numCount = count ? parseInt(count, 10) : 4;

    return this.declarationsService.getDailyDeclarations(
      gender,
      topicList,
      numCount,
    );
  }

  @Get('topics')
  getTopics() {
    return this.declarationsService.getTopics();
  }

  @Get('focus-areas')
  getFocusAreas() {
    return this.declarationsService.getFocusAreas();
  }
}
