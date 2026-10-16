import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { declarationsSeed } from './declarations.seed';
import { devotionalsSeed } from './devotionals.seed';
import { topicsSeed } from './topics.seed';
import { Declaration } from '../features/declarations/domain/declaration.entity';
import { DeclarationTopic } from '../features/declarations/domain/declaration-topic.entity';
import { Devotional } from '../features/devotionals/domain/devotional.entity';
import { Topic } from '../features/topics/domain/topic.entity';
import { TopicPractice } from '../features/topics/domain/topic-practice.entity';
import { Streak } from '../features/streaks/domain/streak.entity';
import { StreakActivityLog } from '../features/streaks/domain/streak-activity-log.entity';
import { User } from '../features/auth/domain/user.entity';
import { RefreshToken } from '../features/auth/domain/refresh-token.entity';
import { UserPreference } from '../features/auth/domain/user-preference.entity';
import { UserSavedDeclaration } from '../features/streaks/domain/user-saved-declaration.entity';
import { UserCompletedDevotional } from '../features/streaks/domain/user-completed-devotional.entity';
import { UserHighlight } from '../features/streaks/domain/user-highlight.entity';
import { UserBadge } from '../features/streaks/domain/user-badge.entity';
import { FocusArea } from '../features/declarations/domain/focus-area.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'pregare',
  entities: [
    User,
    RefreshToken,
    UserPreference,
    Declaration,
    DeclarationTopic,
    Devotional,
    Topic,
    TopicPractice,
    Streak,
    StreakActivityLog,
    UserSavedDeclaration,
    UserCompletedDevotional,
    UserHighlight,
    UserBadge,
    FocusArea,
  ],
  synchronize: true,
});

async function runSeeds() {
  console.log('Connecting to database...');
  await dataSource.initialize();
  console.log('Connected.');

  const userRepo = dataSource.getRepository(User);
  const declRepo = dataSource.getRepository(Declaration);
  const declTopicRepo = dataSource.getRepository(DeclarationTopic);
  const devRepo = dataSource.getRepository(Devotional);
  const topicRepo = dataSource.getRepository(Topic);
  const topicPracticeRepo = dataSource.getRepository(TopicPractice);

  // 0. Ensure default admin and guest users exist
  let adminUser = await userRepo.findOne({ where: { email: 'admin@pregare.app' } });
  if (!adminUser) {
    adminUser = userRepo.create({
      name: 'Pregare Admin',
      email: 'admin@pregare.app',
      gender: 'mujeres',
      provider: 'email',
      role: 'admin',
    });
    await userRepo.save(adminUser);
    console.log('Admin user initialized (admin@pregare.app).');
  } else {
    adminUser.role = 'admin';
    await userRepo.save(adminUser);
  }

  let guestUser = await userRepo.findOne({ where: { id: 'default' } });
  if (!guestUser) {
    guestUser = userRepo.create({
      id: 'default',
      name: 'Invitado',
      email: 'guest@pregare.app',
      gender: 'mujeres',
      provider: 'email',
      role: 'admin', // Allow guest to preview admin studio easily if needed or user
    });
    await userRepo.save(guestUser);
    console.log('Guest user initialized.');
  }

  // 1. Seed Declarations (365 for hombres, 365 for mujeres)
  console.log('Syncing declarations...');
  const decl365Path = path.join(__dirname, 'declarations-365.json');
  if (fs.existsSync(decl365Path)) {
    const raw = fs.readFileSync(decl365Path, 'utf-8');
    const data = JSON.parse(raw);
    const allItems: any[] = [...(data.hombres || []), ...(data.mujeres || [])];

    for (const d of allItems) {
      let existing = await declRepo.findOne({
        where: { dayNumber: d.dayNumber, gender: d.gender },
      });
      if (!existing) {
        existing = declRepo.create({
          dayNumber: d.dayNumber,
          gender: d.gender,
          scriptureText: d.verse,
          scriptureReference: d.reference,
          declarationText: d.text,
          topic: d.topic || (d.topics && d.topics[0]) || 'fe',
        });
        existing = await declRepo.save(existing);
      } else {
        existing.scriptureText = d.verse;
        existing.scriptureReference = d.reference;
        existing.declarationText = d.text;
        existing.topic = d.topic || (d.topics && d.topics[0]) || 'fe';
        await declRepo.save(existing);
      }

      for (const t of (d.topics || [d.topic])) {
        const topicExists = await declTopicRepo.findOne({
          where: { declarationId: existing.id, topicSlug: t },
        });
        if (!topicExists) {
          await declTopicRepo.save(
            declTopicRepo.create({
              declarationId: existing.id,
              topicSlug: t,
            }),
          );
        }
      }
    }
  }
  const totalDecl = await declRepo.count();
  console.log(`Declarations synced. Total in DB: ${totalDecl}`);

  // Seed Focus Areas / Strengths in DB if empty
  const focusAreaRepo = dataSource.getRepository(FocusArea);
  const existingFocusAreasCount = await focusAreaRepo.count();
  if (existingFocusAreasCount === 0) {
    console.log('Seeding initial focus areas...');
    const defaultFocusAreas = [
      { name: 'Peace & Stillness', description: 'Inner calm, resting in God, and quietness of heart', order: 1 },
      { name: 'Faith & Trust', description: 'Deepening faith, radical trust, and believing God promises', order: 2 },
      { name: 'Strength & Courage', description: 'Supernatural fortitude for spiritual and daily battles', order: 3 },
      { name: 'Purpose & Calling', description: 'Clarity on God calling, destiny, and life direction', order: 4 },
      { name: 'Overcoming Anxiety', description: 'Trading worry and panic for God transcendent peace', order: 5 },
      { name: 'Healing & Restoration', description: 'Physical, emotional, and relational wholeness', order: 6 },
      { name: 'Wisdom & Guidance', description: 'Godly discernment in leadership and critical decisions', order: 7 },
      { name: 'Gratitude & Joy', description: 'Cultivating a heart of praise and supernatural joy', order: 8 },
      { name: 'Family & Marriage', description: 'Grace, unity, protection, and blessing over home', order: 9 },
      { name: 'Spiritual Discipline', description: 'Consistency in prayer, scripture reading, and fasting', order: 10 },
      { name: 'Provision & Work', description: 'Excellence in business, career, and financial stewardship', order: 11 },
      { name: 'Identity in Christ', description: 'Rooted as a son/daughter of God, free from comparison', order: 12 },
      { name: 'Hope in Difficult Times', description: 'Anchored assurance in the midst of trials and waiting', order: 13 },
      { name: 'Forgiveness & Freedom', description: 'Releasing bitterness and walking in full spiritual liberty', order: 14 },
    ];

    for (const item of defaultFocusAreas) {
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      await focusAreaRepo.save(
        focusAreaRepo.create({
          name: item.name,
          slug,
          description: item.description,
          order: item.order,
          isActive: true,
        }),
      );
    }
    console.log('Focus areas seeded successfully.');
  }

  // Seed 365 Devotionals if empty
  const existingDevotionalsCount = await devRepo.count();
  if (existingDevotionalsCount === 0) {
    const jsonPath = path.join(__dirname, 'devotionals-365.json');
    if (fs.existsSync(jsonPath)) {
      console.log('Seeding 365 devotionals into MySQL...');
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const items = JSON.parse(raw);
      const entities = items.map((item: any) => {
        const d = new Devotional();
        d.id = item.id;
        d.dayNumber = item.dayNumber;
        d.title = item.title;
        d.durationMinutes = item.durationMinutes || 3;
        d.verseReference = item.verseReference;
        d.verseText = item.verseText;
        d.reflectionText = item.reflectionText;
        d.prayerText = item.prayerText;
        return d;
      });
      await devRepo.save(entities, { chunk: 50 });
      console.log(`365 Devotionals synced to MySQL.`);
    }
  }

  console.log('All seeds synced to MySQL successfully.');
  await dataSource.destroy();
}

runSeeds().catch((err) => {
  console.error('Error running seeds:', err);
  process.exit(1);
});
