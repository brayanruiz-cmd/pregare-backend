import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '../../topics/domain/topic.entity';
import { TopicPractice } from '../../topics/domain/topic-practice.entity';
import { Devotional } from '../../devotionals/domain/devotional.entity';
import { User } from '../../auth/domain/user.entity';
import { Streak } from '../../streaks/domain/streak.entity';
import { FocusArea } from '../../declarations/domain/focus-area.entity';
import { CreateTopicDto } from '../presentation/dto/create-topic.dto';
import { CreateDevotionalDto } from '../presentation/dto/create-devotional.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
    @InjectRepository(TopicPractice)
    private readonly practiceRepo: Repository<TopicPractice>,
    @InjectRepository(Devotional)
    private readonly devRepo: Repository<Devotional>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Streak)
    private readonly streakRepo: Repository<Streak>,
    @InjectRepository(FocusArea)
    private readonly focusAreaRepo: Repository<FocusArea>,
  ) {}

  extractYouTubeVideoId(urlOrId?: string): string | null {
    if (!urlOrId || !urlOrId.trim()) return null;
    const str = urlOrId.trim();

    // If it's already an 11-char video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
      return str;
    }

    // Match standard watch URL, youtu.be, shorts, embed
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = str.match(regExp);
    return match ? match[1] : null;
  }

  private mapTopicToResponse(t: Topic) {
    const tips = t.practices
      ? [...t.practices]
          .sort((a, b) => a.stepNumber - b.stepNumber)
          .map((p) => p.instructionText)
      : [];

    return {
      id: t.sortOrder || 1,
      uuid: t.id,
      tag: t.tag,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      scriptureQuote: t.scriptureQuote,
      scriptureReference: t.scriptureReference,
      supportTips: tips,
      youtubeQuery: t.youtubeQuery,
      youtubeUrl: t.youtubeUrl,
      youtubeVideoId: t.youtubeVideoId,
      videoDurationMinutes: t.videoDurationMinutes || 8,
      createdAt: t.createdAt,
    };
  }

  private mapDevotionalToResponse(d: Devotional) {
    return {
      id: d.dayNumber,
      uuid: d.id,
      day: d.dayNumber,
      dayNumber: d.dayNumber,
      title: d.title,
      verse: d.verseReference ? `${d.verseText} (${d.verseReference})` : d.verseText,
      verseText: d.verseText,
      verseReference: d.verseReference,
      text: d.reflectionText,
      reflectionText: d.reflectionText,
      prayer: d.prayerText,
      prayerText: d.prayerText,
      durationMinutes: d.durationMinutes || 2,
      createdAt: d.createdAt,
    };
  }

  // --- STATS ---
  async getStats() {
    const [totalUsers, totalTopics, totalDevotionals] = await Promise.all([
      this.userRepo.count(),
      this.topicRepo.count(),
      this.devRepo.count(),
    ]);

    return {
      totalUsers,
      totalTopics,
      totalDevotionals,
    };
  }

  // --- TOPICS CRUD ---
  async getAllTopics() {
    const topics = await this.topicRepo.find({
      relations: { practices: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return topics.map((t) => this.mapTopicToResponse(t));
  }

  async createTopic(dto: CreateTopicDto) {
    const videoId = this.extractYouTubeVideoId(dto.youtubeUrl);
    const count = await this.topicRepo.count();

    const topic = this.topicRepo.create({
      sortOrder: count + 1,
      tag: dto.tag,
      title: dto.title,
      subtitle: dto.subtitle,
      description: dto.description,
      scriptureQuote: dto.scriptureQuote,
      scriptureReference: dto.scriptureReference,
      youtubeUrl: dto.youtubeUrl,
      youtubeVideoId: videoId,
      youtubeQuery: dto.youtubeQuery || dto.title,
      videoDurationMinutes: dto.videoDurationMinutes || 8,
    });

    const saved = await this.topicRepo.save(topic);

    if (dto.supportTips && dto.supportTips.length > 0) {
      let step = 1;
      for (const tip of dto.supportTips) {
        if (tip.trim()) {
          await this.practiceRepo.save(
            this.practiceRepo.create({
              topicId: saved.id,
              stepNumber: step++,
              instructionText: tip.trim(),
            }),
          );
        }
      }
    }

    const res = await this.topicRepo.findOne({
      where: { id: saved.id },
      relations: { practices: true },
    });
    return res ? this.mapTopicToResponse(res) : null;
  }

  async updateTopic(id: string, dto: CreateTopicDto) {
    let topic = await this.topicRepo.findOne({ where: { id } });
    if (!topic) {
      const num = parseInt(id, 10);
      if (!isNaN(num)) {
        topic = await this.topicRepo.findOne({ where: { sortOrder: num } });
      }
    }
    if (!topic) throw new NotFoundException('Topic not found');

    const videoId = dto.youtubeUrl
      ? this.extractYouTubeVideoId(dto.youtubeUrl)
      : topic.youtubeVideoId;

    Object.assign(topic, {
      tag: dto.tag,
      title: dto.title,
      subtitle: dto.subtitle,
      description: dto.description,
      scriptureQuote: dto.scriptureQuote,
      scriptureReference: dto.scriptureReference,
      youtubeUrl: dto.youtubeUrl,
      youtubeVideoId: videoId,
      youtubeQuery: dto.youtubeQuery ?? topic.youtubeQuery,
      videoDurationMinutes: dto.videoDurationMinutes ?? topic.videoDurationMinutes,
    });

    await this.topicRepo.save(topic);

    if (dto.supportTips) {
      await this.practiceRepo.delete({ topicId: topic.id });
      let step = 1;
      for (const tip of dto.supportTips) {
        if (tip.trim()) {
          await this.practiceRepo.save(
            this.practiceRepo.create({
              topicId: topic.id,
              stepNumber: step++,
              instructionText: tip.trim(),
            }),
          );
        }
      }
    }

    const res = await this.topicRepo.findOne({
      where: { id: topic.id },
      relations: { practices: true },
    });
    return res ? this.mapTopicToResponse(res) : null;
  }

  async deleteTopic(id: string) {
    let topic = await this.topicRepo.findOne({ where: { id } });
    if (!topic) {
      const num = parseInt(id, 10);
      if (!isNaN(num)) {
        topic = await this.topicRepo.findOne({ where: { sortOrder: num } });
      }
    }
    if (!topic) throw new NotFoundException('Topic not found');
    await this.practiceRepo.delete({ topicId: topic.id });
    await this.topicRepo.delete(topic.id);
    return { success: true };
  }

  // --- DEVOTIONALS CRUD ---
  async getAllDevotionals() {
    const list = await this.devRepo.find({ order: { dayNumber: 'ASC' } });
    return list.map((d) => this.mapDevotionalToResponse(d));
  }

  async createDevotional(dto: CreateDevotionalDto) {
    const dev = this.devRepo.create({
      dayNumber: dto.dayNumber,
      title: dto.title,
      verseText: dto.verseText,
      verseReference: dto.verseReference || '',
      reflectionText: dto.reflectionText,
      prayerText: dto.prayerText,
      durationMinutes: dto.durationMinutes || 2,
    });
    const saved = await this.devRepo.save(dev);
    return this.mapDevotionalToResponse(saved);
  }

  async updateDevotional(id: string, dto: CreateDevotionalDto) {
    const dev = await this.devRepo.findOne({ where: [{ id }, { dayNumber: Number(id) || -1 }] });
    if (!dev) throw new NotFoundException('Devotional not found');

    Object.assign(dev, {
      dayNumber: dto.dayNumber,
      title: dto.title,
      verseText: dto.verseText,
      verseReference: dto.verseReference || '',
      reflectionText: dto.reflectionText,
      prayerText: dto.prayerText,
      durationMinutes: dto.durationMinutes || 2,
    });

    const saved = await this.devRepo.save(dev);
    return this.mapDevotionalToResponse(saved);
  }

  async deleteDevotional(id: string) {
    const dev = await this.devRepo.findOne({ where: [{ id }, { dayNumber: Number(id) || -1 }] });
    if (!dev) throw new NotFoundException('Devotional not found');
    await this.devRepo.delete(dev.id);
    return { success: true };
  }

  // --- FOCUS AREAS / STRENGTHS CRUD ---
  async getAllFocusAreas() {
    return this.focusAreaRepo.find({
      order: { order: 'ASC', id: 'ASC' },
    });
  }

  async createFocusArea(dto: { name: string; description?: string; order?: number }) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const count = await this.focusAreaRepo.count();
    const area = this.focusAreaRepo.create({
      name: dto.name.trim(),
      slug,
      description: dto.description?.trim(),
      order: dto.order ?? count + 1,
      isActive: true,
    });
    return this.focusAreaRepo.save(area);
  }

  async updateFocusArea(
    id: number,
    dto: { name?: string; description?: string; order?: number; isActive?: boolean },
  ) {
    const area = await this.focusAreaRepo.findOne({ where: { id } });
    if (!area) throw new NotFoundException('Focus area not found');

    if (dto.name !== undefined) {
      area.name = dto.name.trim();
      area.slug = dto.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    }
    if (dto.description !== undefined) {
      area.description = dto.description.trim();
    }
    if (dto.order !== undefined) {
      area.order = dto.order;
    }
    if (dto.isActive !== undefined) {
      area.isActive = dto.isActive;
    }

    return this.focusAreaRepo.save(area);
  }

  async deleteFocusArea(id: number) {
    const area = await this.focusAreaRepo.findOne({ where: { id } });
    if (!area) throw new NotFoundException('Focus area not found');
    await this.focusAreaRepo.delete(id);
    return { success: true };
  }
}
