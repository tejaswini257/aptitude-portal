import {
  DifficultyLevel,
  QuestionType,
  QuestionUsage,
} from '@prisma/client';

export class UpdateQuestionDto {
  sectionId?: string;

  questionText?: string;
  difficulty?: DifficultyLevel;
  type?: QuestionType;
  allowedFor?: QuestionUsage;

  correctAnswer?: string;
  codingMeta?: any;
  isActive?: boolean;
}
