import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeclarationsService } from './declarations.service';
import { DeclarationsController } from './declarations.controller';
import { Declaration } from './domain/declaration.entity';
import { DeclarationTopic } from './domain/declaration-topic.entity';
import { FocusArea } from './domain/focus-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Declaration, DeclarationTopic, FocusArea])],
  controllers: [DeclarationsController],
  providers: [DeclarationsService],
  exports: [DeclarationsService, TypeOrmModule],
})
export class DeclarationsModule {}
