import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { DevotionalsService } from './devotionals.service';
import { OptionalJwtAuthGuard } from '../auth/presentation/optional-jwt-auth.guard';

@Controller('devotionals')
export class DevotionalsController {
  constructor(private readonly devotionalsService: DevotionalsService) {}

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
  @Get('daily')
  getDaily(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.devotionalsService.getDaily(userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getAll(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.devotionalsService.getAll(userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  getById(@Req() req: any, @Param('id') id: string) {
    const userId = this.extractUserId(req);
    return this.devotionalsService.getById(id, userId);
  }
}
