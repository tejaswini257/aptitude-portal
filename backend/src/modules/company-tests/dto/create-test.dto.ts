import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { QuestionType, DifficultyLevel } from '@prisma/client';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];
}

export class CreateCompanyTestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  rulesId?: string | null;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @IsNumber()
  @IsOptional()
  marksPerQuestion?: number;

  @IsBoolean()
  @IsOptional()
  negativeMarking?: boolean;

  @IsNumber()
  @IsOptional()
  negativeMarks?: number;

  @IsBoolean()
  @IsOptional()
  showResultImmediately?: boolean;

  @IsBoolean()
  @IsOptional()
  proctoringEnabled?: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];
}
