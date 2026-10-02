import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from '../../src/features/topics/topics.service';

describe('TopicsService', () => {
  let service: TopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicsService],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return 4 topics', () => {
      const topics = service.getAll();
      expect(topics).toHaveLength(4);
    });

    it('should have correct structure', () => {
      const topics = service.getAll();
      const topic = topics[0];
      expect(topic).toHaveProperty('id');
      expect(topic).toHaveProperty('tag');
      expect(topic).toHaveProperty('title');
      expect(topic).toHaveProperty('description');
      expect(topic).toHaveProperty('supportTips');
      expect(topic).toHaveProperty('youtubeQuery');
    });
  });

  describe('getById', () => {
    it('should return topic by id', () => {
      const topic = service.getById(1);
      expect(topic.id).toBe(1);
    });

    it('should throw for non-existent id', () => {
      expect(() => service.getById(999)).toThrow();
    });
  });
});
