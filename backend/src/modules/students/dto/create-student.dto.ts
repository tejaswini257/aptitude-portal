import { IsInt, IsString, Min } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  rollNo: string;

  @IsInt()
  @Min(1)
  year: number;

  @IsString()
  userId: string;

  @IsString()
  collegeId: string;

  @IsString()
  departmentId: string;
}
