import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from '../../src/features/notifications/notifications.controller';
import { NotificationsService } from '../../src/features/notifications/notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationsService],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /notifications/preferences', () => {
    it('should return preferences', () => {
      const result = controller.getPreferences();
      expect(result).toHaveProperty('dailyVerse');
      expect(result).toHaveProperty('reminderTime');
    });
  });

  describe('PUT /notifications/preferences', () => {
    it('should update preferences', () => {
      const result = controller.updatePreferences('user1', {
        dailyVerse: false,
      });
      expect(result.dailyVerse).toBe(false);
    });
  });
});
