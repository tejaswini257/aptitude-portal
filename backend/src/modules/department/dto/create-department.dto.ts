import { IsString, IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";   // ✅ ADD THIS

export class CreateDepartmentDto {
  @IsString()
  name!: string;

  @IsString()
  collegeId!: string;

  @IsOptional()
  @IsString()
  hodName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @Type(() => Number)      // ✅ VERY IMPORTANT
  @IsInt()
  totalStudents?: number;

  @IsOptional()
  @Type(() => Number)      // ✅ VERY IMPORTANT
  @IsInt()
  totalFaculty?: number;
}
