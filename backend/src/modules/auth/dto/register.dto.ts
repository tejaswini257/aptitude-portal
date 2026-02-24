import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
  @IsOptional()
  @IsString()
  orgId?: string;

  // Student specific fields
  @IsOptional()
  @IsString()
  collegeId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  rollNo?: string;

  @IsOptional()
  year?: number;
}
