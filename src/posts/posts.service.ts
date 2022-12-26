import { ApprovePostDto } from './dto/approve-post.dto';
import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RoleEnum } from 'src/users/role.enum';
import { Post, User } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto, user: User) {
    if (!user.activated) {
      throw new UnauthorizedException('you are not activated yet');
    }
    const post = this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        user: { connect: { id: user.id } },
      },
    });
    return post;
  }

  // for auth and non-auth users & also users who have roles 'users'
  async findAllApprovedPost() {
    const posts = await this.prisma.post.findMany({
      where: { approved: true },
    });
    if (posts.length === 0) {
      throw new NotFoundException('posts not found');
    }
    return posts;
  }

  // for auth and non-auth users & also users who have roles 'users'
  async findOneApprovedPost(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post || !post.approved) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  // for admins and supervisors
  async findAllPosts(user: User) {
    const fetchedPosts: Post[] = [];
    const posts = await this.prisma.post.findMany();
    if (user.roles === RoleEnum.admin || user.roles === RoleEnum.supervisor) {
      for (const post of posts) {
        fetchedPosts.push(post);
      }
    } else if (user.roles === RoleEnum.user) {
      throw new UnauthorizedException(
        'you are not allowed to access these data',
      );
    }
    return fetchedPosts;
  }

  // for current logged-in user only
  async findAllCurrentUserPosts(user: User) {
    const fetchedPosts: Post[] = [];
    const posts = await this.prisma.post.findMany({
      where: { userId: user.id },
    });
    for (const post of posts) {
      //  console.log(post.user);
      if (user.id === post.userId) {
        fetchedPosts.push(post);
      }
    }
    if (fetchedPosts.length === 0) {
      throw new NotFoundException('posts not found');
    }
    // const fetchedPosts = plainToClass(Post, posts);
    return fetchedPosts;
  }

  // for current logged-in user only
  async findOneOfCurrentUserPost(id: number, user: User) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post || user.id !== post.userId) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  // for admins and supervisors
  async findOnePost(id: number, user: User) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (user.roles === RoleEnum.user) {
      throw new UnauthorizedException('you are not allowed');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (post.userId !== user.id) {
      throw new UnauthorizedException('Unauthorized to edit this post');
    }
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
    return updatedPost;
  }

  async changeApproval(id: number, approvePostDto: ApprovePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: approvePostDto,
    });
    return updatedPost;
  }

  async remove(id: number, user: User) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (post.userId !== user.id) {
      throw new UnauthorizedException('Unauthorized to delete this post');
    }
    return this.prisma.post.delete({ where: { id } });
  }
}
