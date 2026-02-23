import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateStudentProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsObject()
  education?: {
    tenthPercentage?: number | null;
    twelfthPercentage?: number | null;
    cgpa?: number | null;
    branch?: string | null;
    graduationYear?: number | null;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
