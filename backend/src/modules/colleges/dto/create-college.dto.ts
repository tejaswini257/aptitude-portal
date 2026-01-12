import { IsString, IsNotEmpty, IsEnum, IsEmail, IsInt, Min } from 'class-validator';
import { CollegeType } from '@prisma/client';

export class CreateCollegeDto {
  @IsString()
  @IsNotEmpty()
  collegeName: string;

  @IsEnum(CollegeType)
  collegeType: CollegeType;

  @IsString()
  address: string;

  @IsString()
  contactPerson: string;

  @IsEmail()
  contactEmail: string;

  @IsString()
  mobile: string;

  @IsInt()
  @Min(1)
  maxStudents: number;

  @IsString()
  orgId: string;
}
