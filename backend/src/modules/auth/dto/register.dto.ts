import { IsEmail, IsEnum, IsString, MinLength, IsOptional} from 'class-validator';
import { UserRole } from '@prisma/client';


export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
  
  @IsOptional()
  @IsString()
  orgId?: string;
}
