import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DifficultyLevel, QuestionType } from '@prisma/client';

export class CreateQuestionDto {
  @IsString()
  testId: string;

  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  options?: any;

  @IsOptional()
  correctAnswer?: any;

  @IsOptional()
  evaluationConfig?: any;

  @IsInt()
  @Min(1)
  marks: number;

  @IsOptional()
  @IsInt()
  timeLimitSec?: number;

  @IsInt()
  @Min(1)
  order: number;

  @IsOptional()
  @IsString()
  explanation?: string;
}
