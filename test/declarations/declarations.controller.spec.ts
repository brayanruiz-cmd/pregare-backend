import { Test, TestingModule } from '@nestjs/testing';
import { DeclarationsController } from '../../src/features/declarations/declarations.controller';
import { DeclarationsService } from '../../src/features/declarations/declarations.service';

describe('DeclarationsController', () => {
  let controller: DeclarationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeclarationsController],
      providers: [DeclarationsService],
    }).compile();

    controller = module.get<DeclarationsController>(DeclarationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /declarations/daily', () => {
    it('should return declarations', () => {
      const result = controller.getDaily();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter by gender', () => {
      const result = controller.getDaily('mujer');
      expect(result.every((d) => d.gender === 'mujer')).toBe(true);
    });

    it('should filter by topics', () => {
      const result = controller.getDaily(undefined, 'fortaleza,paz');
      expect(
        result.every(
          (d) => d.topics.includes('fortaleza') || d.topics.includes('paz'),
        ),
      ).toBe(true);
    });

    it('should respect count parameter', () => {
      const result = controller.getDaily(undefined, undefined, '2');
      expect(result).toHaveLength(2);
    });
  });

  describe('GET /declarations/topics', () => {
    it('should return topic labels', () => {
      const result = controller.getTopics();
      expect(result).toHaveProperty('fortaleza');
    });
  });
});
