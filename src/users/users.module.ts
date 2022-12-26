import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'super_secret_dont_tell',
      signOptions: { expiresIn: '9h' },
    }),
  ],
  providers: [UsersService, AuthService, JwtStrategy, RolesGuard],
  controllers: [UsersController],
  exports: [JwtStrategy, PassportModule, UsersService],
})
export class UsersModule {}
