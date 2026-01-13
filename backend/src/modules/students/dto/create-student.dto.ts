import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  rollNo: string;

  @IsInt()
  @Min(1)
  year: number;

  @IsUUID()
  collegeId: string;

  @IsUUID()
  departmentId: string;
}
