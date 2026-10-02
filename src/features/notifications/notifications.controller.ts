import { Controller, Get, Put, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('preferences')
  getPreferences(@Body('userId') userId: string = 'default') {
    return this.notificationsService.getPreferences(userId);
  }

  @Put('preferences')
  updatePreferences(
    @Body('userId') userId: string = 'default',
    @Body()
    prefs: {
      dailyVerse?: boolean;
      declarations?: boolean;
      streakReminder?: boolean;
      reminderTime?: string;
    },
  ) {
    return this.notificationsService.updatePreferences(userId, prefs);
  }
}
