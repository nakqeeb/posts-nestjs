import { ConfigService } from '@nestjs/config';
import { UsersService } from './../users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
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
