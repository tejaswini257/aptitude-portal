import {
  IsEmail,
  IsString,
  IsInt,
  Min,
  Max,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  rollNo: string;

  @IsInt()
  @Min(1)
  @Max(4)
  year: number;

  @IsString()
  @IsNotEmpty()
  collegeId: string;

  @IsString()
  @IsNotEmpty()
  departmentId: string;
}
