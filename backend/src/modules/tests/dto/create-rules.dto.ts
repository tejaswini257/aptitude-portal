import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateRulesDto {
  @IsNumber()
  totalMarks: number;

  @IsBoolean()
  negativeMarking: boolean;

  @IsOptional()
  @IsNumber()
  negativeMarks?: number;
}