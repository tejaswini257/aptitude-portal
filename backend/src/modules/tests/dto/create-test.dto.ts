import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export enum TestType {
  APTITUDE = 'APTITUDE',
  CODING = 'CODING',
  MIXED = 'MIXED',
}

export class CreateTestDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(TestType)
  type: TestType;

  @IsNumber()
  duration: number;

  @IsBoolean()
  showResultImmediately: boolean;

  @IsBoolean()
  proctoringEnabled: boolean;
}

