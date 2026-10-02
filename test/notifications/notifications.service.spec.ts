import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../../src/features/notifications/notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPreferences', () => {
    it('should return default preferences', () => {
      const prefs = service.getPreferences('user1');
      expect(prefs.dailyVerse).toBe(true);
      expect(prefs.declarations).toBe(true);
      expect(prefs.streakReminder).toBe(true);
      expect(prefs.reminderTime).toBe('08:00');
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences', () => {
      const prefs = service.updatePreferences('user1', { dailyVerse: false });
      expect(prefs.dailyVerse).toBe(false);
      expect(prefs.declarations).toBe(true);
    });

    it('should persist preferences', () => {
      service.updatePreferences('user1', { reminderTime: '09:00' });
      const prefs = service.getPreferences('user1');
      expect(prefs.reminderTime).toBe('09:00');
    });
  });
});
