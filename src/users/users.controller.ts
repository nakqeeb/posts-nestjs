import { UsersService } from 'src/users/users.service';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { User } from './entities/user.entity';
import { ActivateUserDto } from './dtos/activate-user.dto';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpUserDto } from './dtos/signup-user.dto';
import { SignInUserDto } from './dtos/signin-user.dto';
import { GetUser } from './auth/decorators/get-user.decorator';
import { NoAuth } from './auth/decorators/no-auth.decorator';
import { Roles } from './auth/decorators/roles.decorator';
import { RoleEnum } from './role.enum';
import { RolesGuard } from './auth/guards/roles.guard';
import { Serialize } from './auth/interceptors/serialize.interceptor';
import { UserDto, UserResponseDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private authService: AuthService, private usersService:UsersService) {}

  @Post('/signup')
  @Serialize(UserDto)
  @NoAuth()
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.signup(signUpUserDto);
  }


  @Post('/signin')
  @Serialize(UserResponseDto)
  @NoAuth()
  signIn(@Body() signInUserDto: SignInUserDto) {
    return this.authService.signin(signInUserDto);
  }
  
  /* @Post('/test')
  @UseGuards(AuthGuard())
  testWithoutGetUserDecorator(@Req() req: any) {
    console.log(req);
  } */


  @Patch('/:id')
  @Serialize(UserDto)
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin)
  activateUser(@Param('id') id: string, @Body() activateUserDto: ActivateUserDto) {
    return this.authService.activateUser(+id, activateUserDto);
  }

  @Patch('/role/:id')
  @Serialize(UserDto)
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin)
  updateUserRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.authService.updateUserRole(+id, updateRoleDto);
  }

  @Get()
  @Serialize(UserDto)
  @UseGuards(RolesGuard) 
  @Roles(RoleEnum.admin)
  findAllUsers() {
    return this.usersService.findAll();
  }
  @Post('/test')
  // @UseGuards(AuthGuard())
  testWithGetUserDecorator(@GetUser()  req: User) {
    console.log(req);
  }
}
