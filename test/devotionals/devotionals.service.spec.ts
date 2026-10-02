import { Test, TestingModule } from '@nestjs/testing';
import { DevotionalsService } from '../../src/features/devotionals/devotionals.service';

describe('DevotionalsService', () => {
  let service: DevotionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevotionalsService],
    }).compile();

    service = module.get<DevotionalsService>(DevotionalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDaily', () => {
    it('should return a devotional', () => {
      const devotional = service.getDaily();
      expect(devotional).toBeDefined();
      expect(devotional).toHaveProperty('id');
      expect(devotional).toHaveProperty('title');
      expect(devotional).toHaveProperty('verse');
      expect(devotional).toHaveProperty('text');
      expect(devotional).toHaveProperty('prayer');
    });

    it('should be deterministic', () => {
      const first = service.getDaily();
      const second = service.getDaily();
      expect(first.id).toBe(second.id);
    });
  });

  describe('getById', () => {
    it('should return devotional by id', () => {
      const devotional = service.getById(1);
      expect(devotional.id).toBe(1);
    });

    it('should throw for non-existent id', () => {
      expect(() => service.getById(999)).toThrow();
    });
  });

  describe('getAll', () => {
    it('should return all devotionals', () => {
      const devotionals = service.getAll();
      expect(devotionals.length).toBe(30);
    });
  });
});
