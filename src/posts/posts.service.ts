import { User } from './../users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { RoleEnum } from 'src/users/role.enum';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private repo: Repository<Post>) {}

  create(createPostDto: CreatePostDto, user: User) {
    if (!user.activated) {
      throw new UnauthorizedException('you are not activated yet');
    }
    const post = this.repo.create(createPostDto);
    post.user = user;
    return this.repo.save(post);
  }

  // for auth and non-auth users & also users who have roles 'users'
  async findAllApprovedPost() {
    let fetchedPosts: Post[] = [];
    const posts = await this.repo.find();
    for (var post of posts) {
      //  console.log(post.user);
      if (post.approved) {
        fetchedPosts.push(post);
      }
    }
    if (fetchedPosts.length === 0) {
      throw new NotFoundException('posts not found');
    }
    // const fetchedPosts = plainToClass(Post, posts);
    return fetchedPosts;
  }
  // for auth and non-auth users & also users who have roles 'users'
  async findOneApprovedPost(id: number) {
    const post = await this.repo.findOneBy({ id });
    if (!post || !post.approved) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  // for admins and supervisors
  async findAllPosts(user: User) {
    let fetchedPosts: Post[] = [];
    const posts = await this.repo.find();
    if (user.roles === RoleEnum.admin || user.roles === RoleEnum.supervisor) {
      for (var post of posts) {
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
    let fetchedPosts: Post[] = [];
    const posts = await this.repo.find();
    for (var post of posts) {
      //  console.log(post.user);
      if (user.id === post.user.id) {
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
    const post = await this.repo.findOneBy({ id });
    if (!post || user.id !== post.user.id) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  // for admins and supervisors
  async findOnePost(id: number, user: User) {
    const post = await this.repo.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (user.roles === RoleEnum.user) {
      throw new UnauthorizedException('you are not allowed');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.repo.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (post.user.id !== user.id) {
      throw new UnauthorizedException('Unauthorized to edit this post');
    }
    post.title = updatePostDto.title;
    post.content = updatePostDto.content;
    post.approved = false;
    return this.repo.save(post);
  }

  async changeApproval(id: number, approved: boolean) {
    const post = await this.repo.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    post.approved = approved;
    return this.repo.save(post);
  }

  async remove(id: number, user: User) {
    const post = await this.repo.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (post.user.id !== user.id) {
      throw new UnauthorizedException('Unauthorized to delete this post');
    }
    return this.repo.delete(id);
  }
}
