import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Declaration as DeclarationEntity } from './domain/declaration.entity';
import { FocusArea } from './domain/focus-area.entity';

export interface DeclarationResponse {
  id: string;
  gender: string;
  topics: string[];
  text: string;
  reference: string;
  verse: string;
  dayNumber?: number;
}

const TOPIC_LABELS: Record<string, string> = {
  amorpropio: 'Self-Love',
  identidad: 'Identity',
  fortaleza: 'Strength',
  proposito: 'Purpose',
  paz: 'Peace',
  sanidad: 'Healing',
  familia: 'Family',
  provision: 'Provision',
  negocios: 'Business',
  gratitud: 'Gratitude',
  fe: 'Faith',
  valentia: 'Courage',
  restauracion: 'Restoration',
  liderazgo: 'Leadership',
  batallas: 'Battles',
  disciplina: 'Discipline',
};

@Injectable()
export class DeclarationsService {
  constructor(
    @InjectRepository(DeclarationEntity)
    private readonly declarationRepo: Repository<DeclarationEntity>,
    @InjectRepository(FocusArea)
    private readonly focusAreaRepo: Repository<FocusArea>,
  ) {}

  async getFocusAreas(): Promise<FocusArea[]> {
    return this.focusAreaRepo.find({
      where: { isActive: true },
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  getTopics(): Record<string, string> {
    return TOPIC_LABELS;
  }

  getDayOfYear(date: Date = new Date()): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return Math.min(365, Math.max(1, day));
  }

  async getTodayDeclaration(
    gender?: string,
    targetDay?: number,
  ): Promise<DeclarationResponse> {
    const day = targetDay || this.getDayOfYear();
    const normalizedGender =
      gender &&
      (gender.toLowerCase() === 'mujer' ||
        gender.toLowerCase() === 'mujeres' ||
        gender.toLowerCase() === 'women' ||
        gender.toLowerCase() === 'female')
        ? 'mujeres'
        : gender &&
            (gender.toLowerCase() === 'hombre' ||
              gender.toLowerCase() === 'hombres' ||
              gender.toLowerCase() === 'men' ||
              gender.toLowerCase() === 'male')
          ? 'hombres'
          : 'mujeres';

    // 1. Try finding by dayNumber and gender
    let item = await this.declarationRepo
      .createQueryBuilder('dec')
      .leftJoinAndSelect('dec.topics', 'dt')
      .where('dec.dayNumber = :day', { day })
      .andWhere('(dec.gender = :g OR dec.gender = :all)', {
        g: normalizedGender,
        all: 'todos',
      })
      .getOne();

    // 2. If not found by exact dayNumber, fallback to any matching gender
    if (!item) {
      item = await this.declarationRepo
        .createQueryBuilder('dec')
        .leftJoinAndSelect('dec.topics', 'dt')
        .where('(dec.gender = :g OR dec.gender = :all)', {
          g: normalizedGender,
          all: 'todos',
        })
        .orderBy('dec.createdAt', 'ASC')
        .getOne();
    }

    // 3. Fallback to any declaration in DB
    if (!item) {
      item = await this.declarationRepo
        .createQueryBuilder('dec')
        .leftJoinAndSelect('dec.topics', 'dt')
        .getOne();
    }

    if (!item) {
      return {
        id: 'default',
        gender: normalizedGender,
        topics: ['faith'],
        text: 'The Lord is my light and my salvation; whom shall I fear?',
        reference: 'Psalm 27:1',
        verse:
          'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?',
        dayNumber: day,
      };
    }

    return {
      id: item.id,
      gender: item.gender,
      topics:
        item.topics && item.topics.length > 0
          ? item.topics.map((t) => t.topicSlug)
          : [item.topic],
      text: item.declarationText,
      reference: item.scriptureReference,
      verse: item.scriptureText,
      dayNumber: item.dayNumber || day,
    };
  }

  async getDailyDeclarations(
    gender?: string,
    topics?: string[],
    count: number = 4,
  ): Promise<DeclarationResponse[]> {
    const qb = this.declarationRepo
      .createQueryBuilder('dec')
      .leftJoinAndSelect('dec.topics', 'dt');

    if (gender && (gender === 'mujer' || gender === 'mujeres')) {
      qb.andWhere('(dec.gender = :g OR dec.gender = :all)', {
        g: 'mujeres',
        all: 'todos',
      });
    } else if (gender && (gender === 'hombre' || gender === 'hombres')) {
      qb.andWhere('(dec.gender = :g OR dec.gender = :all)', {
        g: 'hombres',
        all: 'todos',
      });
    }

    const allDeclarations = await qb.getMany();

    let filtered = allDeclarations;
    if (topics && topics.length > 0) {
      const lowerTopics = topics.map((t) => t.toLowerCase());
      filtered = filtered.filter((d) => {
        const primaryMatch = lowerTopics.includes(d.topic.toLowerCase());
        const relationsMatch = d.topics?.some((rel) =>
          lowerTopics.includes(rel.topicSlug.toLowerCase()),
        );
        return primaryMatch || relationsMatch;
      });
    }

    // Deterministic shuffle for today
    const today = new Date();
    const seed =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();
    const shuffled = this.mulberry32(seed, filtered.length > 0 ? filtered : allDeclarations);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    return selected.map((d) => ({
      id: d.id,
      gender: d.gender,
      topics:
        d.topics && d.topics.length > 0
          ? d.topics.map((t) => t.topicSlug)
          : [d.topic],
      text: d.declarationText,
      reference: d.scriptureReference,
      verse: d.scriptureText,
    }));
  }

  private mulberry32<T>(seed: number, arr: T[]): T[] {
    const result = [...arr];
    let s = seed;

    for (let i = result.length - 1; i > 0; i--) {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      const j = ((t ^ (t >>> 14)) >>> 0) % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }
}
