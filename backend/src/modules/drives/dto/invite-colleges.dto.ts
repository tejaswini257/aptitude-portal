import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class InviteCollegesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  collegeIds: string[];
}
