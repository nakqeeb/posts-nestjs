import { UpdateRoleDto } from './../dtos/update-role.dto';
import { ActivateUserDto } from './../dtos/activate-user.dto';
import { SignInUserDto } from './../dtos/signin-user.dto';
import { SignUpUserDto } from './../dtos/signup-user.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signup(signUpUserDto: SignUpUserDto) {
    const { name, email, password } = signUpUserDto;
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    // Hash users password
    // Generate a salt
    const saltOrRounds = 10;
    // Hash the salt and the password together
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    // Create a new user and save it
    const user = await this.usersService.create(name, email, hashedPassword);

    // return the user
    return user;
  }

  async signin(signInUserDto: SignInUserDto) {
    const { email, password } = signInUserDto;
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (await bcrypt.compare(password, user.password)) {
      // Generate JWT Token
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      const expiresIn = 540;
      return { user, accessToken, expiresIn };
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  activateUser(id: number, activateUserDto: ActivateUserDto) {
    return this.usersService.update(id, activateUserDto);
  }

  updateUserRole(id: number, updateRoleDto: UpdateRoleDto) {
    return this.usersService.update(id, updateRoleDto);
  }
}
