import { Expose, Type } from 'class-transformer';
import { RoleEnum } from '../role.enum';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  activated: boolean;

  @Expose()
  roles: RoleEnum;
}

export class UserResponseDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  accessToken: string;
}
