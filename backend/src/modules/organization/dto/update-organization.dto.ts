import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrgType } from '@prisma/client';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(OrgType)
  type?: OrgType;
}
