import { Test, TestingModule } from '@nestjs/testing';
import { DevotionalsController } from '../../src/features/devotionals/devotionals.controller';
import { DevotionalsService } from '../../src/features/devotionals/devotionals.service';

describe('DevotionalsController', () => {
  let controller: DevotionalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevotionalsController],
      providers: [DevotionalsService],
    }).compile();

    controller = module.get<DevotionalsController>(DevotionalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /devotionals/daily', () => {
    it('should return daily devotional', () => {
      const result = controller.getDaily();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
    });
  });

  describe('GET /devotionals', () => {
    it('should return all devotionals', () => {
      const result = controller.getAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(30);
    });
  });

  describe('GET /devotionals/:id', () => {
    it('should return devotional by id', () => {
      const result = controller.getById(1);
      expect(result.id).toBe(1);
    });
  });
});
