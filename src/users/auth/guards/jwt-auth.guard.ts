import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  /* async canActivate(context: ExecutionContext): Promise<boolean> {
      const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler())

      if(noAuth) return true
      } */

  canActivate(context: ExecutionContext) {
    // we need the JwtAuthGuard to return true when the "@NoAuth" metadata is found. For this, we'll use the Reflector
    // refer to [https://docs.nestjs.com/security/authentication#enable-authentication-globally]
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler());

    if (noAuth) return true; // if @NoAuth() decorator is set then return true

    // The following comment from stackoverflow
    /*
      Oh, that's great! To sum up, super.canActivate(context) returns a boolean whether the valid token is issued for the valid user, and after calling it req.user is set, so I can work with further logic using req.user. 
    */
    return super.canActivate(context);
  }

  /* handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          throw err || new UnauthorizedException();
        }
        console.log(user);
        return user;
      } */
}
