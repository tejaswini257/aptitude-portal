import {
  IsString,
  IsEnum,
  IsInt,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { DifficultyLevel, QuestionUsage } from "@prisma/client";

class TestCaseDto {
  @IsString()
  input!: string;

  @IsString()
  expectedOutput!: string;
}

export class CreateCodingQuestionDto {
  @IsString()
  sectionId!: string;

  @IsString()
  questionText!: string;

  @IsEnum(DifficultyLevel)
  difficulty!: DifficultyLevel;

  @IsEnum(QuestionUsage)
  allowedFor!: QuestionUsage;

  @IsInt()
  marks!: number;

  @IsString()
  constraints!: string;

  @IsString()
  inputFormat!: string;

  @IsString()
  outputFormat!: string;

  @IsString()
  sampleInput!: string;

  @IsString()
  sampleOutput!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  testCases!: TestCaseDto[];

  @IsInt()
  timeLimitMs!: number;

  @IsInt()
  memoryLimitMb!: number;

  @IsArray()
  @IsString({ each: true })
  allowedLanguages!: string[];
}