import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateDevotionalDto {
  @IsNumber()
  @IsNotEmpty()
  dayNumber: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  verseText: string;

  @IsString()
  @IsOptional()
  verseReference?: string;

  @IsString()
  @IsNotEmpty()
  reflectionText: string;

  @IsString()
  @IsNotEmpty()
  prayerText: string;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number;
}
