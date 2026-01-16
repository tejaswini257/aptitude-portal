import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum QuestionType {
  MCQ = 'MCQ',
  CODING = 'CODING',
  APTITUDE = 'APTITUDE',
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export class CreateQuestionDto {
  @IsString()
  testId: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @IsString()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  options?: any;

  @IsOptional()
  correctAnswer?: any;

  @IsInt()
  marks: number;

  @IsOptional()
  negativeMarks?: number;

  @IsInt()
  @Min(1)
  order: number;
}