import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(300)
  durationMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  marksPerQuestion?: number;

  @IsOptional()
  @IsBoolean()
  negativeMarking?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  negativeMarks?: number;

  @IsOptional()
  @IsBoolean()
  showResultImmediately?: boolean;

  @IsOptional()
  @IsBoolean()
  proctoringEnabled?: boolean;
}
