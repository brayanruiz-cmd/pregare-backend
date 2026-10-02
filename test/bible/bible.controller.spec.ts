import { Test, TestingModule } from '@nestjs/testing';
import { BibleController } from '../../src/features/bible/bible.controller';
import { BibleService } from '../../src/features/bible/bible.service';
import { HttpException } from '@nestjs/common';

describe('BibleController', () => {
  let controller: BibleController;
  let service: BibleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BibleController],
      providers: [
        {
          provide: BibleService,
          useValue: {
            getVersions: jest.fn(),
            getBooks: jest.fn(),
            getChapter: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BibleController>(BibleController);
    service = module.get<BibleService>(BibleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /bible/versions', () => {
    it('should return versions', () => {
      const mockVersions = [{ id: 'RVR1960', name: 'Reina-Valera 1960' }];
      (service.getVersions as jest.Mock).mockReturnValue(mockVersions);

      const result = controller.getVersions();
      expect(result).toEqual(mockVersions);
      expect(service.getVersions).toHaveBeenCalled();
    });
  });

  describe('GET /bible/books', () => {
    it('should return books for default version', () => {
      const mockBooks = [{ id: 'genesis', name: 'Génesis' }];
      (service.getBooks as jest.Mock).mockReturnValue(mockBooks);

      const result = controller.getBooks();
      expect(result).toEqual(mockBooks);
      expect(service.getBooks).toHaveBeenCalledWith('RVR1960');
    });

    it('should return books for specific version', () => {
      const mockBooks = [{ id: 'genesis', name: 'Genesis' }];
      (service.getBooks as jest.Mock).mockReturnValue(mockBooks);

      const result = controller.getBooks('KJV');
      expect(result).toEqual(mockBooks);
      expect(service.getBooks).toHaveBeenCalledWith('KJV');
    });
  });

  describe('GET /bible/read/:book/:chapter', () => {
    it('should return chapter', async () => {
      const mockChapter = {
        book: 'genesis',
        chapter: 1,
        verses: [{ number: 1, text: 'En el principio...' }],
      };
      (service.getChapter as jest.Mock).mockResolvedValue(mockChapter);

      const result = await controller.getChapter('genesis', '1', 'RVR1960');
      expect(result).toEqual(mockChapter);
      expect(service.getChapter).toHaveBeenCalledWith('genesis', 1, 'RVR1960');
    });

    it('should throw for invalid chapter number', async () => {
      await expect(controller.getChapter('genesis', 'abc')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw for negative chapter', async () => {
      await expect(controller.getChapter('genesis', '-1')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw when book not found', async () => {
      (service.getChapter as jest.Mock).mockRejectedValue(
        new Error('Book not found: invalid'),
      );
      await expect(controller.getChapter('invalid', '1')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
