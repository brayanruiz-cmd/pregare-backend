import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { OptionalJwtAuthGuard } from '../auth/presentation/optional-jwt-auth.guard';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  private extractUserId(req: any): string {
    if (req.user?.id) {
      return req.user.id;
    }
    const headerUserId = req.headers['x-user-id'];
    if (headerUserId && typeof headerUserId === 'string') {
      return headerUserId;
    }
    return 'default';
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('daily-verse')
  @ApiOperation({ summary: 'Get daily verse and summary from database' })
  async getDailyVerse(@Req() req: any) {
    const userId = this.extractUserId(req);
    const verse = await this.homeService.getDailyVerse();
    const { greeting, emoji } = this.homeService.getGreeting();
    const devotional = await this.homeService.getDailyDevotionalSummary(userId);
    return {
      greeting,
      emoji,
      dailyVerse: verse,
      dailyDevotional: devotional,
    };
  }
}
