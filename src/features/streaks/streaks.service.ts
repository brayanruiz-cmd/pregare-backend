import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Streak } from './domain/streak.entity';
import { StreakActivityLog } from './domain/streak-activity-log.entity';
import { UserSavedDeclaration } from './domain/user-saved-declaration.entity';
import { UserCompletedDevotional } from './domain/user-completed-devotional.entity';
import { UserHighlight } from './domain/user-highlight.entity';
import { UserBadge } from './domain/user-badge.entity';
import { Declaration } from '../declarations/domain/declaration.entity';

export interface BadgeDto {
  code: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedAt: string | null;
  progress: number;
}

export interface StreakResponse {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
  totalDaysActive: number;
  declarationsSpoken: number;
  chaptersRead: number;
  savedDeclarationsCount: number;
  highlightsCount: number;
  completedDevotionalsCount: number;
}

export interface MonthActivityResponse {
  year: number;
  month: number;
  monthName: string;
  activeDaysCount: number;
  totalDaysInMonth: number;
  activeDates: string[];
  logs: {
    date: string;
    declarationsRead: number;
    chaptersRead: number;
    devotionalCompleted: boolean;
  }[];
}

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(Streak)
    private readonly streakRepo: Repository<Streak>,
    @InjectRepository(StreakActivityLog)
    private readonly logRepo: Repository<StreakActivityLog>,
    @InjectRepository(UserSavedDeclaration)
    private readonly savedDeclRepo: Repository<UserSavedDeclaration>,
    @InjectRepository(UserCompletedDevotional)
    private readonly compDevRepo: Repository<UserCompletedDevotional>,
    @InjectRepository(UserHighlight)
    private readonly highlightRepo: Repository<UserHighlight>,
    @InjectRepository(UserBadge)
    private readonly badgeRepo: Repository<UserBadge>,
    @InjectRepository(Declaration)
    private readonly declRepo: Repository<Declaration>,
  ) {}

  async getStreak(userId: string): Promise<StreakResponse> {
    if (!userId || userId === 'default') {
      return {
        userId: 'default',
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null,
        totalDaysActive: 0,
        declarationsSpoken: 0,
        chaptersRead: 0,
        savedDeclarationsCount: 0,
        highlightsCount: 0,
        completedDevotionalsCount: 0,
      };
    }

    let streak = await this.streakRepo.findOne({ where: { userId } });

    if (!streak) {
      streak = this.streakRepo.create({
        userId,
        currentStreakDays: 0,
        longestStreak: 0,
        totalDaysActive: 0,
        lastCheckInDate: null,
        declarationsSpokenCount: 0,
        chaptersReadCount: 0,
      });
      // Save only if not guest or can be saved
      try {
        streak = await this.streakRepo.save(streak);
      } catch {
        // In case foreign key constraints fail for dummy users
      }
    } else {
      const today = this.getToday();
      if (streak.lastCheckInDate) {
        const daysSince = this.daysBetween(streak.lastCheckInDate, today);
        if (daysSince > 1 && streak.currentStreakDays > 0) {
          streak.currentStreakDays = 0;
          try {
            await this.streakRepo.save(streak);
          } catch {}
        }
      }
    }

    // Counts from user activity tables
    let savedDeclCount = 0;
    let compDevCount = 0;
    let highlightCount = 0;

    try {
      [savedDeclCount, compDevCount, highlightCount] = await Promise.all([
        this.savedDeclRepo.count({ where: { userId } }),
        this.compDevRepo.count({ where: { userId } }),
        this.highlightRepo.count({ where: { userId } }),
      ]);
    } catch {
      // Table may be empty or not yet populated
    }

    return {
      userId: streak.userId,
      currentStreak: streak.currentStreakDays,
      longestStreak: streak.longestStreak,
      lastCheckInDate: streak.lastCheckInDate,
      totalDaysActive: streak.totalDaysActive,
      declarationsSpoken: streak.declarationsSpokenCount,
      chaptersRead: streak.chaptersReadCount,
      savedDeclarationsCount: savedDeclCount,
      highlightsCount: highlightCount,
      completedDevotionalsCount: compDevCount,
    };
  }

  async checkIn(userId: string): Promise<StreakResponse> {
    const today = this.getToday();
    let streak = await this.streakRepo.findOne({ where: { userId } });

    if (!streak) {
      streak = this.streakRepo.create({
        userId,
        currentStreakDays: 1,
        longestStreak: 1,
        totalDaysActive: 1,
        lastCheckInDate: today,
        declarationsSpokenCount: 0,
        chaptersReadCount: 0,
      });
    } else {
      if (streak.lastCheckInDate === today) {
        return this.getStreak(userId);
      }

      if (streak.lastCheckInDate) {
        const daysSince = this.daysBetween(streak.lastCheckInDate, today);
        if (daysSince === 1) {
          streak.currentStreakDays += 1;
        } else {
          streak.currentStreakDays = 1;
        }
      } else {
        streak.currentStreakDays = 1;
      }

      streak.lastCheckInDate = today;
      streak.totalDaysActive += 1;

      if (streak.currentStreakDays > streak.longestStreak) {
        streak.longestStreak = streak.currentStreakDays;
      }
    }

    try {
      await this.streakRepo.save(streak);
    } catch {}

    // Record in daily activity log
    try {
      let log = await this.logRepo.findOne({
        where: { userId, activityDate: today },
      });
      if (!log) {
        log = this.logRepo.create({
          userId,
          activityDate: today,
          devotionalCompleted: true,
          declarationsRead: 4,
        });
        await this.logRepo.save(log);
      }
    } catch {}

    return this.getStreak(userId);
  }

  async getMonthActivity(
    userId: string,
    year?: number,
    month?: number,
  ): Promise<MonthActivityResponse> {
    const now = new Date();
    const currentYear = year || now.getFullYear();
    const currentMonth = month || now.getMonth() + 1;

    const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
    const lastDayNum = new Date(currentYear, currentMonth, 0).getDate();
    const endDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(lastDayNum).padStart(2, '0')}`;

    let logs: StreakActivityLog[] = [];
    try {
      logs = await this.logRepo.find({
        where: {
          userId,
          activityDate: Between(startDate, endDate),
        },
        order: { activityDate: 'ASC' },
      });
    } catch {}

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const activeDates = logs.map((l) => l.activityDate);

    return {
      year: currentYear,
      month: currentMonth,
      monthName: monthNames[currentMonth - 1] || 'Current Month',
      activeDaysCount: logs.length,
      totalDaysInMonth: lastDayNum,
      activeDates,
      logs: logs.map((l) => ({
        date: l.activityDate,
        declarationsRead: l.declarationsRead,
        chaptersRead: l.chaptersRead,
        devotionalCompleted: l.devotionalCompleted,
      })),
    };
  }

  async completeDevotional(
    userId: string,
    devotionalId: string,
  ): Promise<{
    success: boolean;
    streak: StreakResponse;
    newBadges: BadgeDto[];
  }> {
    let existing = await this.compDevRepo.findOne({
      where: { userId, devotionalId },
    });
    if (!existing) {
      existing = this.compDevRepo.create({
        userId,
        devotionalId,
      });
      await this.compDevRepo.save(existing);
    }

    const streak = await this.checkIn(userId);
    const newBadges = await this.checkAndAwardBadges(userId);

    return {
      success: true,
      streak,
      newBadges,
    };
  }

  async proclaimDeclaration(
    userId: string,
    declarationId: string,
    gender?: string,
  ): Promise<{
    success: boolean;
    streak: StreakResponse;
  }> {
    let resolvedId = declarationId;
    if (declarationId && !declarationId.includes('-')) {
      const day = parseInt(declarationId, 10);
      if (!isNaN(day)) {
        const query: any = { dayNumber: day };
        if (gender) {
          const normalized =
            gender.toLowerCase().startsWith('h') || gender.toLowerCase().includes('men')
              ? 'hombres'
              : 'mujeres';
          query.gender = normalized;
        }
        const found = await this.declRepo.findOne({ where: query });
        if (found) {
          resolvedId = found.id;
        }
      }
    }

    let existing = await this.savedDeclRepo.findOne({
      where: [
        { userId, declarationId: resolvedId },
        { userId, declarationId },
      ],
    });
    if (!existing) {
      existing = this.savedDeclRepo.create({
        userId,
        declarationId: resolvedId,
      });
      await this.savedDeclRepo.save(existing);
    }

    // Update streak activity and daily check-in
    await this.checkIn(userId);

    let streakEntity = await this.streakRepo.findOne({ where: { userId } });
    if (streakEntity) {
      streakEntity.declarationsSpokenCount =
        (streakEntity.declarationsSpokenCount || 0) + 1;
      await this.streakRepo.save(streakEntity);
    }

    const updatedStreak = await this.getStreak(userId);
    return {
      success: true,
      streak: updatedStreak,
    };
  }

  async getProclaimedDeclarationIds(userId: string): Promise<string[]> {
    if (!userId || userId === 'default') return [];
    try {
      const records = await this.savedDeclRepo.find({
        where: { userId },
        select: { declarationId: true },
      });
      const ids = new Set<string>();
      for (const r of records) {
        if (!r.declarationId) continue;
        ids.add(r.declarationId);
        if (r.declarationId.includes('-')) {
          const found = await this.declRepo.findOne({
            where: { id: r.declarationId },
            select: { id: true, dayNumber: true, gender: true },
          });
          if (found?.dayNumber != null && found?.gender) {
            ids.add(`${found.gender}_${found.dayNumber}`);
            ids.add(`${found.gender}_day_${found.dayNumber}`);
          }
        }
      }
      return Array.from(ids);
    } catch {
      return [];
    }
  }

  async getCompletedDevotionalIds(userId: string): Promise<string[]> {
    if (!userId || userId === 'default') return [];
    try {
      const records = await this.compDevRepo.find({
        where: { userId },
        select: { devotionalId: true },
      });
      return records.map((r) => r.devotionalId);
    } catch {
      return [];
    }
  }

  async getBadges(userId: string): Promise<BadgeDto[]> {
    if (!userId || userId === 'default') {
      return [];
    }
    const streak = await this.getStreak(userId);
    let userBadges: UserBadge[] = [];
    try {
      userBadges = await this.badgeRepo.find({ where: { userId } });
    } catch {}
    const badgeMap = new Map(userBadges.map((b) => [b.badgeCode, b]));

    const catalog = [
      {
        code: 'FIRST_DEVOTIONAL',
        title: 'First Light',
        description: 'Completed your first daily devotional journey.',
        icon: '🌅',
        category: 'devotional',
        target: 1,
        current: streak.completedDevotionalsCount,
      },
      {
        code: 'STREAK_3',
        title: 'Faithful Steps',
        description: 'Maintained a 3-day continuous prayer streak.',
        icon: '🔥',
        category: 'streak',
        target: 3,
        current: streak.currentStreak,
      },
      {
        code: 'STREAK_7',
        title: 'Seven Days of Grace',
        description: 'A full week anchored in scripture and meditation.',
        icon: '🌟',
        category: 'streak',
        target: 7,
        current: streak.currentStreak,
      },
      {
        code: 'STREAK_30',
        title: 'Unshakeable Habit',
        description: '30 days walking steadfastly with the Father.',
        icon: '🛡️',
        category: 'streak',
        target: 30,
        current: streak.currentStreak,
      },
      {
        code: 'DEVOTIONAL_14',
        title: 'Secret Place',
        description: 'Completed 14 daily devotionals in total.',
        icon: '🕊️',
        category: 'devotional',
        target: 14,
        current: streak.completedDevotionalsCount,
      },
      {
        code: 'BIBLE_READER',
        title: 'Word of Life',
        description: 'Read and reflected on chapters in the Holy Bible.',
        icon: '📖',
        category: 'bible',
        target: 1,
        current: streak.chaptersRead,
      },
      {
        code: 'TOPIC_EXPLORER',
        title: 'Deep Waters',
        description: 'Explored a spiritual topic and watched its teaching.',
        icon: '🎬',
        category: 'topics',
        target: 1,
        current: streak.declarationsSpoken > 0 ? 1 : 0,
      },
    ];

    return catalog.map((item) => {
      const userBadge = badgeMap.get(item.code);
      const isUnlocked = !!userBadge || item.current >= item.target;
      const progress = item.target > 0 ? Math.min(1.0, item.current / item.target) : 0;
      return {
        code: item.code,
        title: item.title,
        description: item.description,
        icon: item.icon,
        category: item.category,
        isUnlocked,
        unlockedAt: userBadge
          ? userBadge.unlockedAt.toISOString()
          : isUnlocked
            ? new Date().toISOString()
            : null,
        progress: isUnlocked ? 1.0 : Number(progress.toFixed(2)),
      };
    });
  }

  async checkAndAwardBadges(userId: string): Promise<BadgeDto[]> {
    const badges = await this.getBadges(userId);
    const newlyAwarded: BadgeDto[] = [];

    for (const b of badges) {
      if (b.isUnlocked) {
        try {
          const existing = await this.badgeRepo.findOne({
            where: { userId, badgeCode: b.code },
          });
          if (!existing) {
            const badgeEntity = this.badgeRepo.create({
              userId,
              badgeCode: b.code,
              title: b.title,
              description: b.description,
              icon: b.icon,
              category: b.category,
            });
            await this.badgeRepo.save(badgeEntity);
            newlyAwarded.push(b);
          }
        } catch {}
      }
    }

    return newlyAwarded;
  }

  private getToday(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  private daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}
