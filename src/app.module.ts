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
      type: 'mongodb',
      url: 'mongodb+srv://nakqeeb:' +
      'VmkNU1vgqHFnNCDL' +
      '@cluster0.rbc72.mongodb.net/posts-app',
      entities: [User, Post],
      synchronize: true,
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      logging: true,
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
