import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../application/auth.service';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';
import { UserPreference } from '../domain/user-preference.entity';

@ApiTags('Preferences')
@Controller('users/me/preferences')
export class PreferencesController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get current user preferences' })
  async getPreferences(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.authService.getPreferences(userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  @ApiOperation({ summary: 'Update current user preferences' })
  async updatePreferences(
    @Req() req: any,
    @Body() body: Partial<UserPreference>,
  ) {
    const userId = this.extractUserId(req);
    return this.authService.updatePreferences(userId, body);
  }
}
