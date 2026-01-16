import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TestType } from '@prisma/client';

export class CreateTestDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TestType)
  type: TestType;

  @IsInt()
  @Min(1)
  duration: number;

  @IsOptional()
  @IsBoolean()
  showResultImmediately?: boolean = false;

  @IsOptional()
  @IsBoolean()
  proctoringEnabled?: boolean = false;
}
