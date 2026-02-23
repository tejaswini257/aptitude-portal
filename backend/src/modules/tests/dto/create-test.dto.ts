

/*export class CreateTestDto {
  name: string;
  orgId: string;
  rulesId: string;
  showResultImmediately?: boolean;
  proctoringEnabled?: boolean;
} 
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  ValidateNested,
  IsArray,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

class RulesDto {
  @IsInt()
  @Min(1)
  totalMarks!: number;

  @IsInt()
  @Min(1)
  marksPerQuestion!: number;

  @IsBoolean()
  negativeMarking!: boolean;

  @IsOptional()
  @IsInt()
  negativeMarks?: number;
}

class SectionInputDto {
  @IsString()
  sectionId!: string;

  @IsInt()
  @Min(1)
  timeLimit!: number;
}

export class CreateTestDto {
  @IsString()
  name!: string;

  @IsBoolean()
  @IsOptional()
  showResultImmediately?: boolean;

  @IsBoolean()
  @IsOptional()
  proctoringEnabled?: boolean;

  @ValidateNested()
  @Type(() => RulesDto)
  rules!: RulesDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionInputDto)
  sections!: SectionInputDto[];
}*/


import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateTestDto {
  @IsString()
  name: string;

  @IsUUID()
  orgId: string;

  @IsUUID()
  rulesId: string;

  @IsOptional()
  @IsBoolean()
  showResultImmediately?: boolean;

  @IsOptional()
  @IsBoolean()
  proctoringEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}
