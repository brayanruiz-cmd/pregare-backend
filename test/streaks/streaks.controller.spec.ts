import { Test, TestingModule } from '@nestjs/testing';
import { StreaksController } from '../../src/features/streaks/streaks.controller';
import { StreaksService } from '../../src/features/streaks/streaks.service';

describe('StreaksController', () => {
  let controller: StreaksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreaksController],
      providers: [StreaksService],
    }).compile();

    controller = module.get<StreaksController>(StreaksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /streaks/me', () => {
    it('should return streak', () => {
      const result = controller.getStreak();
      expect(result).toHaveProperty('currentStreak');
      expect(result).toHaveProperty('longestStreak');
    });
  });

  describe('POST /streaks/checkin', () => {
    it('should check in', () => {
      const result = controller.checkIn();
      expect(result.currentStreak).toBe(1);
    });
  });
});
