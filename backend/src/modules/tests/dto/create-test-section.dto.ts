import { IsNumber, IsString } from 'class-validator';

export class CreateTestSectionDto {
  @IsString()
  sectionId: string;

  @IsNumber()
  timeLimit: number;
}