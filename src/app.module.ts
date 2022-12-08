import { JwtAuthGuard } from './users/auth/guards/jwt-auth.guard';
import { Post } from './posts/entities/post.entity';
import { User } from './users/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5442,
      username: 'postgres',
      password: '123456',
      database: 'posts-backend',
      entities: [User, Post],
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
