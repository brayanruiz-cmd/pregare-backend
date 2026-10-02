import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Devotional } from '../features/devotionals/domain/devotional.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'pregare',
  entities: [Devotional],
  synchronize: true,
});

async function seed365Devotionals() {
  console.log('Connecting to database...');
  await dataSource.initialize();
  console.log('Connected.');

  const devRepo = dataSource.getRepository(Devotional);

  // Clear existing devotionals table for a fresh clean seed
  console.log('Cleaning existing devotionals...');
  await dataSource.query('DELETE FROM devotionals');

  const jsonPath = path.join(__dirname, 'devotionals-365.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`File not found: ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const items: Array<{
    id: string;
    dayNumber: number;
    title: string;
    durationMinutes: number;
    verseReference: string;
    verseText: string;
    reflectionText: string;
    prayerText: string;
  }> = JSON.parse(raw);

  console.log(`Loaded ${items.length} devotionals from JSON. Inserting into MySQL...`);

  const entities = items.map((item) => {
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

  const total = await devRepo.count();
  console.log(`Successfully seeded ${total} devotionals in MySQL!`);

  await dataSource.destroy();
}

seed365Devotionals().catch((err) => {
  console.error('Error seeding 365 devotionals:', err);
  process.exit(1);
});
