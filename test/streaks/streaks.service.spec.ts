import { Test, TestingModule } from '@nestjs/testing';
import { StreaksService } from '../../src/features/streaks/streaks.service';

describe('StreaksService', () => {
  let service: StreaksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreaksService],
    }).compile();

    service = module.get<StreaksService>(StreaksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStreak', () => {
    it('should return default streak for new user', () => {
      const streak = service.getStreak('user1');
      expect(streak.currentStreak).toBe(0);
      expect(streak.longestStreak).toBe(0);
      expect(streak.totalDaysActive).toBe(0);
    });
  });

  describe('checkIn', () => {
    it('should create streak on first check-in', () => {
      const streak = service.checkIn('user1');
      expect(streak.currentStreak).toBe(1);
      expect(streak.totalDaysActive).toBe(1);
      expect(streak.lastCheckInDate).toBeTruthy();
    });

    it('should not increment on same day check-in', () => {
      service.checkIn('user1');
      const streak = service.checkIn('user1');
      expect(streak.currentStreak).toBe(1);
      expect(streak.totalDaysActive).toBe(1);
    });

    it('should update longest streak', () => {
      service.checkIn('user1');
      const streak = service.getStreak('user1');
      expect(streak.longestStreak).toBe(1);
    });
  });
});
