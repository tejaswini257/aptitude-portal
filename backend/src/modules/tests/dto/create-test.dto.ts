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
}