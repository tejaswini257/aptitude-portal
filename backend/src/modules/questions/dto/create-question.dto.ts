import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import {
  QuestionType,
  DifficultyLevel,
  QuestionUsage,
  CreatorRole,
} from '@prisma/client';

export class CreateQuestionDto {
  @IsString()
  sectionId!: string;

  @IsEnum(QuestionType)
  type!: QuestionType;

  @IsEnum(DifficultyLevel)
  difficulty!: DifficultyLevel;

  @IsEnum(QuestionUsage)
  allowedFor!: QuestionUsage;

  @IsString()
  questionText!: string;

  @IsOptional()
  correctAnswer?: string;

  @IsOptional()
  codingMeta?: any;

  @IsOptional()
  @IsArray()
  options?: {
    optionCode: string;
    optionText: string;
    isCorrect: boolean;
  }[];

  @IsNumber()
  marks!: number;
}