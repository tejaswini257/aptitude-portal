import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { CollegeType } from '@prisma/client';

export class CreateCollegeDto {
  @IsUUID()
  orgId: string;

  @IsString()
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
}
