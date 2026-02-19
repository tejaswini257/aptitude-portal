import { SectionType } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  sectionName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;

  @IsEnum(SectionType)
  type!: SectionType;
}
