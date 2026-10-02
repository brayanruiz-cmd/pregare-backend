import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from '../../src/features/topics/topics.controller';
import { TopicsService } from '../../src/features/topics/topics.service';

describe('TopicsController', () => {
  let controller: TopicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [TopicsService],
    }).compile();

    controller = module.get<TopicsController>(TopicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /topics', () => {
    it('should return all topics', () => {
      const result = controller.getAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
    });
  });

  describe('GET /topics/:id', () => {
    it('should return topic by id', () => {
      const result = controller.getById(1);
      expect(result.id).toBe(1);
    });
  });
});
