import { RoleEnum } from './../../role.enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles); // 'roles' should be same as in RolesGuard
