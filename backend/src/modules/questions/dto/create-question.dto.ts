import {
  DifficultyLevel,
  QuestionType,
  QuestionUsage,
  CreatorRole,
} from '@prisma/client';

export class CreateQuestionDto {
  sectionId: string;

  orgId: string;
  questionText: string;

  difficulty: DifficultyLevel;
  type: QuestionType;
  allowedFor: QuestionUsage;

  createdBy: string;
  creatorRole: CreatorRole;
}
