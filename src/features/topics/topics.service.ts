import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic as TopicEntity } from './domain/topic.entity';

export interface TopicResponse {
  id: number;
  uuid: string;
  tag: string;
  title: string;
  subtitle?: string | null;
  description: string;
  scriptureQuote?: string | null;
  scriptureReference?: string | null;
  supportTips: string[];
  youtubeQuery: string;
  youtubeUrl?: string | null;
  youtubeVideoId?: string | null;
  videoDurationMinutes: number;
}

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepo: Repository<TopicEntity>,
  ) {}

  private mapToResponse(t: TopicEntity): TopicResponse {
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
    };
  }

  async getAll(): Promise<TopicResponse[]> {
    const topics = await this.topicRepo.find({
      relations: { practices: true },
      order: { sortOrder: 'ASC' },
    });
    return topics.map((t) => this.mapToResponse(t));
  }

  async getById(idOrOrder: string | number): Promise<TopicResponse> {
    const num =
      typeof idOrOrder === 'number' ? idOrOrder : parseInt(idOrOrder, 10);
    let topic: TopicEntity | null = null;

    if (!isNaN(num)) {
      topic = await this.topicRepo.findOne({
        where: [{ sortOrder: num }],
        relations: { practices: true },
      });
    }

    if (!topic && typeof idOrOrder === 'string') {
      topic = await this.topicRepo.findOne({
        where: [{ id: idOrOrder }],
        relations: { practices: true },
      });
    }

    if (!topic) {
      throw new NotFoundException(`Topic ${idOrOrder} not found`);
    }

    return this.mapToResponse(topic);
  }
}
