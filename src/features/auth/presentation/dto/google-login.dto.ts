import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({ description: 'Google ID token (mobile)' })
  @IsString()
  idToken: string;

  @ApiProperty({
    description: 'Google authorization code (web)',
    required: false,
  })
  @IsString()
  @IsOptional()
  code?: string;
}
