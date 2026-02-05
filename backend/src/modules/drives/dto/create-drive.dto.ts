import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDriveDto {
  @IsUUID()
  testId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isOpenDrive: boolean;
}
