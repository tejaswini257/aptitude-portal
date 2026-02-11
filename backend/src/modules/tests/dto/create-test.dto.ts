import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsBoolean()
  showResultImmediately?: boolean;

  @IsOptional()
  @IsBoolean()
  proctoringEnabled?: boolean;
}
