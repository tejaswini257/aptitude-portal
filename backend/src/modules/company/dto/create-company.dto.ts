import { IsString, IsEmail } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  adminPassword: string;
}
