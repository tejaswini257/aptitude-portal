import { IsUUID } from 'class-validator';

export class StartSubmissionDto {
  @IsUUID()
  testId: string;
}
