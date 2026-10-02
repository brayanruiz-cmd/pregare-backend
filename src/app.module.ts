import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './features/auth/auth.module';
import { HomeModule } from './features/home/home.module';
import { BibleModule } from './features/bible/bible.module';
import { DeclarationsModule } from './features/declarations/declarations.module';
import { DevotionalsModule } from './features/devotionals/devotionals.module';
import { TopicsModule } from './features/topics/topics.module';
import { StreaksModule } from './features/streaks/streaks.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { AdminModule } from './features/admin/admin.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_DATABASE', 'pregare'),
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
    TerminusModule,
    AuthModule,
    HomeModule,
    BibleModule,
    DeclarationsModule,
    DevotionalsModule,
    TopicsModule,
    StreaksModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
