import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateDepartmentDto {

  @IsOptional()
  @IsString()
  name?: string;

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
  @IsInt()
  totalStudents?: number;

  @IsOptional()
  @IsInt()
  totalFaculty?: number;
}

