import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { TestStatus, TestType } from '@prisma/client';

export class UpdateTestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TestType)
  type?: TestType;

  @IsOptional()
  @IsEnum(TestStatus)
  status?: TestStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;
}
