import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  adminPassword: string;
}
