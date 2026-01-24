import { IsEmail, IsString, IsInt } from 'class-validator';

export class CreateStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  rollNo: string;

  @IsInt()
  year: number;

  @IsString()
  collegeId: string;

  @IsString()
  departmentId: string;

  @IsString()
  orgId: string;
}

