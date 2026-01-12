import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CollegeType } from '@prisma/client';

export class UpdateCollegeDto {
  @IsOptional()
  @IsString()
  collegeName?: string;

  @IsOptional()
  @IsEnum(CollegeType)
  collegeType?: CollegeType;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxStudents?: number;

  @IsOptional()
  isApproved?: boolean;
}
