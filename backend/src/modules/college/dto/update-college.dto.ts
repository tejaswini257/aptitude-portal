import { IsOptional, IsString } from 'class-validator';

export class UpdateCollegeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;
}
