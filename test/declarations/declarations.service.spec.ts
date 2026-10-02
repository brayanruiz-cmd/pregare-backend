import { Test, TestingModule } from '@nestjs/testing';
import { DeclarationsService } from '../../src/features/declarations/declarations.service';

describe('DeclarationsService', () => {
  let service: DeclarationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeclarationsService],
    }).compile();

    service = module.get<DeclarationsService>(DeclarationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTopics', () => {
    it('should return topic labels', () => {
      const topics = service.getTopics();
      expect(topics).toHaveProperty('fortaleza');
      expect(topics).toHaveProperty('paz');
      expect(topics.fortaleza).toBe('Fortaleza');
    });
  });

  describe('getDailyDeclarations', () => {
    it('should return 4 declarations by default', () => {
      const declarations = service.getDailyDeclarations();
      expect(declarations).toHaveLength(4);
    });

    it('should return correct count', () => {
      const declarations = service.getDailyDeclarations(
        undefined,
        undefined,
        2,
      );
      expect(declarations).toHaveLength(2);
    });

    it('should filter by gender', () => {
      const women = service.getDailyDeclarations('mujer');
      expect(women.every((d) => d.gender === 'mujer')).toBe(true);
    });

    it('should filter by topic', () => {
      const declarations = service.getDailyDeclarations(undefined, [
        'fortaleza',
      ]);
      expect(declarations.every((d) => d.topics.includes('fortaleza'))).toBe(
        true,
      );
    });

    it('should be deterministic', () => {
      const first = service.getDailyDeclarations();
      const second = service.getDailyDeclarations();
      expect(first.map((d) => d.id)).toEqual(second.map((d) => d.id));
    });

    it('should have declaration structure', () => {
      const declarations = service.getDailyDeclarations();
      const dec = declarations[0];
      expect(dec).toHaveProperty('id');
      expect(dec).toHaveProperty('gender');
      expect(dec).toHaveProperty('topics');
      expect(dec).toHaveProperty('text');
      expect(dec).toHaveProperty('reference');
      expect(dec).toHaveProperty('verse');
    });
  });
});
