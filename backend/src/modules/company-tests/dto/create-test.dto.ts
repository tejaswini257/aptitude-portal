import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyTestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  rulesId: string;

  @IsBoolean()
  showResultImmediately: boolean;

  @IsBoolean()
  proctoringEnabled: boolean;
}
