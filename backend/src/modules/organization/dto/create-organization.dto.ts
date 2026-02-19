import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrgType } from '@prisma/client';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(OrgType)
  type: OrgType;
}

//export class UpdateOrganizationDto {
 // @IsOptional()
 // @IsString()
 // name?: string;
//}

