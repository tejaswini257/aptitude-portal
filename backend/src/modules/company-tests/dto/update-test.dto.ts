import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyTestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  showResultImmediately?: boolean;

  @IsOptional()
  @IsBoolean()
  proctoringEnabled?: boolean;
}
