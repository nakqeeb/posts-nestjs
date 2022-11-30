import { RolesGuard } from 'src/users/auth/guards/roles.guard';
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
      type: 'sqlite',
      database: 'postsdb.sqlite',
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
      useClass: JwtAuthGuard
    },
  ],
})
export class AppModule {}
