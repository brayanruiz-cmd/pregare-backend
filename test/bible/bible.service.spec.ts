import { Test, TestingModule } from '@nestjs/testing';
import { BibleService } from '../../src/features/bible/bible.service';
import { ConfigService } from '@nestjs/config';

describe('BibleService', () => {
  let service: BibleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BibleService, { provide: ConfigService, useValue: {} }],
    }).compile();

    service = module.get<BibleService>(BibleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVersions', () => {
    it('should return 2 versions (KJV and RVR1960)', () => {
      const versions = service.getVersions();
      expect(versions).toHaveLength(2);
      expect(versions.map((v) => v.id)).toContain('RVR1960');
      expect(versions.map((v) => v.id)).toContain('KJV');
    });

    it('should have correct structure', () => {
      const versions = service.getVersions();
      const rvr = versions.find((v) => v.id === 'RVR1960');
      expect(rvr).toEqual({
        id: 'RVR1960',
        name: 'Reina-Valera 1960',
        abbreviation: 'RVR1960',
        language: 'es',
      });
    });
  });

  describe('getBooks', () => {
    it('should return 66 books', () => {
      const books = service.getBooks('RVR1960');
      expect(books).toHaveLength(66);
    });

    it('should have OT and NT books', () => {
      const books = service.getBooks('RVR1960');
      const otBooks = books.filter((b) => b.testament === 'OT');
      const ntBooks = books.filter((b) => b.testament === 'NT');
      expect(otBooks.length).toBeGreaterThan(0);
      expect(ntBooks.length).toBeGreaterThan(0);
    });

    it('should include genesis', () => {
      const books = service.getBooks('RVR1960');
      const genesis = books.find((b) => b.id === 'genesis');
      expect(genesis).toBeDefined();
      expect(genesis?.chapters).toBe(50);
    });

    it('should include revelation / apocalipsis', () => {
      const books = service.getBooks('RVR1960');
      const revelation = books.find((b) => b.id === 'revelation');
      expect(revelation).toBeDefined();
      expect(revelation?.chapters).toBe(22);
    });
  });

  describe('getChapter', () => {
    it('should throw for invalid book', async () => {
      await expect(service.getChapter('invalid-book', 1)).rejects.toThrow(
        'Book not found',
      );
    });

    it('should throw for chapter out of range', async () => {
      await expect(service.getChapter('genesis', 999)).rejects.toThrow(
        'out of range',
      );
    });

    it('should throw for chapter 0', async () => {
      await expect(service.getChapter('genesis', 0)).rejects.toThrow(
        'out of range',
      );
    });
  });
});
