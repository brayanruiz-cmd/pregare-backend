import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { OptionalJwtAuthGuard } from '../auth/presentation/optional-jwt-auth.guard';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  private extractUserId(req: any, bodyUserId?: string): string {
    if (req.user?.id) {
      return req.user.id;
    }
    if (bodyUserId && bodyUserId !== 'default') {
      return bodyUserId;
    }
    const headerUserId = req.headers['x-user-id'];
    if (headerUserId && typeof headerUserId === 'string') {
      return headerUserId;
    }
    return 'default';
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('me')
  getStreak(@Req() req: any, @Query('userId') queryUserId?: string) {
    const userId = this.extractUserId(req, queryUserId);
    return this.streaksService.getStreak(userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('checkin')
  checkIn(@Req() req: any, @Body('userId') bodyUserId?: string) {
    const userId = this.extractUserId(req, bodyUserId);
    return this.streaksService.checkIn(userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('activity')
  getMonthActivity(
    @Req() req: any,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const userId = this.extractUserId(req);
    const parsedYear = year ? parseInt(year, 10) : undefined;
    const parsedMonth = month ? parseInt(month, 10) : undefined;
    return this.streaksService.getMonthActivity(userId, parsedYear, parsedMonth);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('badges')
  getBadges(@Req() req: any, @Query('userId') queryUserId?: string) {
    const userId = this.extractUserId(req, queryUserId);
    return this.streaksService.getBadges(userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('devotionals/completed')
  async getCompletedDevotionals(
    @Req() req: any,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.extractUserId(req, queryUserId);
    return this.streaksService.getCompletedDevotionalIds(userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('devotionals/:id/complete')
  async completeDevotional(
    @Req() req: any,
    @Param('id') devotionalId: string,
    @Body('userId') bodyUserId?: string,
  ) {
    const userId = this.extractUserId(req, bodyUserId);
    if (userId === 'default') {
      throw new UnauthorizedException(
        'Please sign in to save your devotional progress and maintain your streak',
      );
    }
    return this.streaksService.completeDevotional(userId, devotionalId);
  }
}
