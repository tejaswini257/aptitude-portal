import {
  IsEnum,
  IsBoolean,
  IsString,
  IsInt,
  ValidateNested,
  ValidateIf,
  IsOptional,
} from 'class-validator';
import { Type } from "class-transformer";
import {
  QuestionType,
  DifficultyLevel,
  QuestionUsage,
} from '@prisma/client';

export class CreateOptionDto {
  @IsString()
  text!: string;

  @IsBoolean()
  isCorrect!: boolean;
}

export class CreateQuestionDto {
  @IsString()
  sectionId!: string;

  @IsEnum(QuestionType)
  type!: QuestionType;

  @IsEnum(DifficultyLevel)
  difficulty!: DifficultyLevel;

  // Only required if NOT unseen paragraph
  @ValidateIf(o => o.type !== QuestionType.UNSEEN_PARAGRAPH)
  @IsString()
  questionText!: string;

  @IsEnum(QuestionUsage)
  allowedFor!: QuestionUsage;

  @IsInt()
  marks!: number;

  // Only required for MCQ types
  @ValidateIf(o =>
    o.type === QuestionType.MCQ_SINGLE ||
    o.type === QuestionType.MCQ_MULTIPLE
  )
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];

  // Optional meta containers
  @IsOptional()
  unseenParagraphMeta?: any;
}