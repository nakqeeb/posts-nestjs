import { RoleEnum } from './../../role.enum';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /* canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 'roles' should be same as in roles.decorator.ts
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    console.log(requiredRoles);

    const { user }: { user: User } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user.roles?.includes(role));
  } */

    // The following code works and the above code is works as well.
  canActivate(context: ExecutionContext): boolean {
    // 'roles' should be same as in roles.decorator.ts
    const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    console.log(roles);
    const request = context.switchToHttp().getRequest();
   // console.log(request);
    const user = request.user;
    return this.matchRoles(roles, user.roles);
    // return roles.some((role: RoleEnum) => user.role.includes(role));
  }

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

}