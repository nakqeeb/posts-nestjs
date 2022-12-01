import { IsEnum } from 'class-validator';
import { RoleEnum } from '../role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  roles: RoleEnum;
}
