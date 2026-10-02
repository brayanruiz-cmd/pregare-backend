import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsIn,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Sarah' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'sarah@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must have at least 8 chars, 1 uppercase and 1 number',
  })
  password: string;

  @ApiPropertyOptional({ example: 'mujeres', enum: ['mujeres', 'hombres', 'female', 'male'] })
  @IsOptional()
  @IsIn(['mujeres', 'hombres', 'female', 'male'])
  gender?: string;

  @ApiPropertyOptional({ example: ['Faith', 'Strength', 'Peace'] })
  @IsOptional()
  @IsArray()
  selectedTopics?: string[];

  @ApiPropertyOptional({ example: '06:15:00' })
  @IsOptional()
  @IsString()
  notificationTime?: string;

  @ApiPropertyOptional({ example: 'America/Bogota' })
  @IsOptional()
  @IsString()
  timezone?: string;
}
