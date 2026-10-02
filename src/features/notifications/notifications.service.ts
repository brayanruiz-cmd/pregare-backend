import { Injectable } from '@nestjs/common';

export interface NotificationPreferences {
  userId: string;
  dailyVerse: boolean;
  declarations: boolean;
  streakReminder: boolean;
  reminderTime: string;
}

@Injectable()
export class NotificationsService {
  private preferences = new Map<string, NotificationPreferences>();

  getPreferences(userId: string): NotificationPreferences {
    return (
      this.preferences.get(userId) || {
        userId,
        dailyVerse: true,
        declarations: true,
        streakReminder: true,
        reminderTime: '08:00',
      }
    );
  }

  updatePreferences(
    userId: string,
    prefs: Partial<NotificationPreferences>,
  ): NotificationPreferences {
    const current = this.getPreferences(userId);
    const updated = { ...current, ...prefs, userId };
    this.preferences.set(userId, updated);
    return updated;
  }
}
