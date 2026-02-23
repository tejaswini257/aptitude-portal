import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  DifficultyLevel,
  QuestionType,
  QuestionUsage,
  CreatorRole,
} from '@prisma/client';

export class CreateQuestionDto {
  @IsUUID()
  sectionId: string;

  @IsUUID()
  orgId: string;

  @IsString()
  questionText: string;

  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsEnum(QuestionUsage)
  allowedFor: QuestionUsage;

  @IsString()
  createdBy: string;

  @IsEnum(CreatorRole)
  creatorRole: CreatorRole;

  @IsOptional()
  correctAnswer?: string;

  @IsOptional()
  codingMeta?: any;
}
