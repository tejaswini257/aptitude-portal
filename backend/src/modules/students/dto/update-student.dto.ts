import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  rollNo?: string;

  @IsOptional()
  @IsInt()
  year?: number;
}
