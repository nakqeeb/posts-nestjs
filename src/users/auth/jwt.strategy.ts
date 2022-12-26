import { UsersService } from './../users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from './jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'super_secret_dont_tell',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const users: User[] = await this.usersService.find(email);

    if (users.length <= 0) {
      throw new UnauthorizedException();
    }

    return users[0];
  }
}
