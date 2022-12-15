import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    /* PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('super_secret_dont_tell'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }), */
    PassportModule.register({ defaultStrategy: 'jwt' }),
    /* JwtModule.register({
      secret: 'super_secret_dont_tell',
      signOptions: { expiresIn: '9h' },
    }), */
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRATION_TIME'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService, AuthService, JwtStrategy, RolesGuard],
  controllers: [UsersController],
  exports: [JwtStrategy, PassportModule, UsersService],
})
export class UsersModule {}
