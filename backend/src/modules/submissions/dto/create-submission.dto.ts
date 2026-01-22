import { IsUUID } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  testId: string;

  @IsUUID()
  studentId: string;
}
