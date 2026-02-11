import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  rollNo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  year?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  departmentId?: string;
}
