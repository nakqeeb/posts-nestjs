import { ObjectID } from 'typeorm';
import { Expose, Transform, Type } from 'class-transformer';
import { RoleEnum } from '../role.enum';

export class UserDto {
  @Expose()
  @Transform((from: any) => from.obj.id, { toClassOnly: true }) // to fix: ObjectID changes per serialization
  id: string;

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
