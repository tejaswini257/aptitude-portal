import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrgType } from '@prisma/client';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(OrgType)
  type: OrgType;
}
