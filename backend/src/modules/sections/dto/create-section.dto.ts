import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

const SECTION_TYPES = [
  "MCQ",
  "CODING",
  "PASSAGE_WRITING",
  "PASSAGE_DROPDOWN",
  "UNSEEN_PARAGRAPH",
  "MIXED"
] as const;

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  sectionName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isQuestionBank?: boolean;

  @IsIn(SECTION_TYPES)
  type!: (typeof SECTION_TYPES)[number];
}
