import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devotional as DevotionalEntity } from './domain/devotional.entity';
import { UserCompletedDevotional } from '../streaks/domain/user-completed-devotional.entity';

export interface DevotionalResponse {
  id: number;
  uuid: string;
  day: number;
  title: string;
  verse: string;
  verseReference: string;
  text: string;
  prayer: string;
  durationMinutes: number;
  isCompleted: boolean;
}

@Injectable()
export class DevotionalsService {
  constructor(
    @InjectRepository(DevotionalEntity)
    private readonly devotionalRepo: Repository<DevotionalEntity>,
    @InjectRepository(UserCompletedDevotional)
    private readonly compDevRepo: Repository<UserCompletedDevotional>,
  ) {}

  private async getCompletedSet(userId?: string): Promise<Set<string>> {
    if (!userId || userId === 'default') {
      return new Set<string>();
    }
    try {
      const completed = await this.compDevRepo.find({
        where: { userId },
        select: { devotionalId: true },
      });
      return new Set(completed.map((c) => c.devotionalId));
    } catch {
      return new Set<string>();
    }
  }

  private mapToResponse(d: DevotionalEntity, completedSet?: Set<string>): DevotionalResponse {
    const isCompleted = completedSet
      ? completedSet.has(d.id) || completedSet.has(String(d.dayNumber))
      : false;

    return {
      id: d.dayNumber,
      uuid: d.id,
      day: d.dayNumber,
      title: d.title,
      verse: d.verseReference ? `${d.verseText} (${d.verseReference})` : d.verseText,
      verseReference: d.verseReference,
      text: d.reflectionText,
      prayer: d.prayerText,
      durationMinutes: d.durationMinutes || 2,
      isCompleted,
    };
  }

  async getDaily(userId?: string): Promise<DevotionalResponse> {
    const devotionals = await this.devotionalRepo.find({
      order: { dayNumber: 'ASC' },
    });

    if (!devotionals || devotionals.length === 0) {
      throw new NotFoundException('No devotionals found in database');
    }

    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % devotionals.length;

    const completedSet = await this.getCompletedSet(userId);
    return this.mapToResponse(devotionals[index], completedSet);
  }

  async getById(idOrDay: string | number, userId?: string): Promise<DevotionalResponse> {
    const num = typeof idOrDay === 'number' ? idOrDay : parseInt(idOrDay, 10);
    let devotional: DevotionalEntity | null = null;

    if (!isNaN(num)) {
      devotional = await this.devotionalRepo.findOne({
        where: [{ dayNumber: num }],
      });
    }

    if (!devotional && typeof idOrDay === 'string') {
      devotional = await this.devotionalRepo.findOne({
        where: [{ id: idOrDay }],
      });
    }

    if (!devotional) {
      throw new NotFoundException(`Devotional ${idOrDay} not found`);
    }

    const completedSet = await this.getCompletedSet(userId);
    return this.mapToResponse(devotional, completedSet);
  }

  async getAll(userId?: string): Promise<DevotionalResponse[]> {
    const devotionals = await this.devotionalRepo.find({
      order: { dayNumber: 'ASC' },
    });
    const completedSet = await this.getCompletedSet(userId);
    return devotionals.map((d) => this.mapToResponse(d, completedSet));
  }
}
