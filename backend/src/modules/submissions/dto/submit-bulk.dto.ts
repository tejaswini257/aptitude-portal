import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerItemDto {
  @IsString()
  questionId!: string;

  @IsString()
  selectedAnswer!: string;
}

export class SubmitBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers!: { questionId: string; selectedAnswer: string }[];
}
