import { UsersService } from 'src/users/users.service';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { ActivateUserDto } from './dtos/activate-user.dto';
import { AuthService } from './auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignUpUserDto } from './dtos/signup-user.dto';
import { SignInUserDto } from './dtos/signin-user.dto';
import { NoAuth } from './auth/decorators/no-auth.decorator';
import { Roles } from './auth/decorators/roles.decorator';
import { RoleEnum } from './role.enum';
import { RolesGuard } from './auth/guards/roles.guard';
import { Serialize } from './auth/interceptors/serialize.interceptor';
import { UserDto, UserResponseDto } from './dtos/user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth') // This is the one that needs to match the name in main.ts. added here to test '/onlyauth' endpoint
@ApiTags('Authentication & Managing the users')
@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({
    summary:
      'Register new user. Ex: {"name": "Ali": "email": "test@test.com", "password": "123456"}',
  })
  @Post('/signup')
  @Serialize(UserDto)
  @NoAuth()
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.signup(signUpUserDto);
  }

  @ApiOperation({
    summary:
      'Login an already registered user. Ex: { "email": "test@test.com", "password": "123456" }',
  })
  @Post('/signin')
  @Serialize(UserResponseDto)
  @NoAuth()
  async signIn(@Body() signInUserDto: SignInUserDto) {
    const response = await this.authService.signin(signInUserDto);
    return { response, expiresIn: 540 };
  }

  @ApiOperation({
    summary:
      'Activate & Deactivate the registered users by the admin only. Ex: { "activated": true }',
  })
  @Patch('/:id')
  @Serialize(UserDto)
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin)
  activateUser(
    @Param('id') id: string,
    @Body() activateUserDto: ActivateUserDto,
  ) {
    return this.authService.activateUser(+id, activateUserDto);
  }

  @ApiOperation({
    summary:
      'Managing the users roles by the admin only. Ex: { "roles": "supervisor" }',
  })
  @Patch('/role/:id')
  @Serialize(UserDto)
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin)
  updateUserRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.authService.updateUserRole(+id, updateRoleDto);
  }

  @ApiOperation({
    summary: 'Get all the users information by the admin only.',
  })
  @Get()
  @Serialize(UserDto)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.admin)
  findAllUsers() {
    return this.usersService.findAll();
  }

  /* @Post('/test')
  @UseGuards(AuthGuard())
  testWithoutGetUserDecorator(@Req() req: any) {
    console.log(req);
  } */
  /* @Post('/test')
  // @UseGuards(AuthGuard())
  testWithGetUserDecorator(@GetUser()  req: User) {
    console.log(req);
  } */
}
