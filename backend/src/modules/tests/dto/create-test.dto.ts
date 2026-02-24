import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRulesDto } from './create-rules.dto';
import { CreateTestSectionDto } from './create-test-section.dto';

export class CreateTestDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  showResultImmediately?: boolean;

  @IsOptional()
  @IsBoolean()
  proctoringEnabled?: boolean;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString()
  durationMode?: string;

  @IsOptional()
  totalDuration?: number;

  @IsOptional()
  @IsDateString()
  resultPublishTime?: string;

  @ValidateNested()
  @Type(() => CreateRulesDto)
  rules: CreateRulesDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestSectionDto)
  sections: CreateTestSectionDto[];
}