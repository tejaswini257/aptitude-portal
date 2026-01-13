import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  year?: number;
}
