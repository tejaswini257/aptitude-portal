import { IsString, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { QuestionType, DifficultyLevel } from '@prisma/client';

export class CreateQuestionDto {
  @IsString()
  testId!: string;   // <-- ADD !

  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsEnum(QuestionType)
  type!: QuestionType;   // <-- ADD !

  @IsEnum(DifficultyLevel)
  difficulty!: DifficultyLevel; // <-- ADD !

  @IsString()
  title!: string;  // <-- ADD !

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  options?: any[];

  @IsOptional()
  correctAnswer?: any;

  @IsOptional()
  evaluationConfig?: any;

  @IsNumber()
  marks!: number;   // <-- ADD !

  @IsOptional()
  @IsNumber()
  timeLimitSec?: number;

  @IsNumber()
  order!: number;   // <-- ADD !

  @IsOptional()
  @IsString()
  explanation?: string;
}
