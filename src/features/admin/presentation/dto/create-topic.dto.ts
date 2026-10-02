import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  scriptureQuote?: string;

  @IsString()
  @IsOptional()
  scriptureReference?: string;

  @IsString()
  @IsOptional()
  youtubeUrl?: string;

  @IsString()
  @IsOptional()
  youtubeQuery?: string;

  @IsNumber()
  @IsOptional()
  videoDurationMinutes?: number;

  @IsArray()
  @IsOptional()
  supportTips?: string[];
}
