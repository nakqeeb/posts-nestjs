import { User } from './../users/entities/user.entity';
import { MongoRepository, Repository } from 'typeorm';
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
const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private repo: MongoRepository<Post>) {}

  create(createPostDto: CreatePostDto, user: User) {
    if (!user.activated) {
      throw new UnauthorizedException('you are not activated yet');
    }
    const post = this.repo.create(createPostDto);
    post.userId = user.id;
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
  async findOneApprovedPost(id: string) {
    const post = await this.repo.findOneBy(ObjectId(id));
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
      // this is how to compare two mongoDB IDs refer to [https://stackoverflow.com/a/11638106/12636434]
      // console.log(ObjectId(user.id).equals(ObjectId(post.userId)));
      if (ObjectId(user.id).equals(ObjectId(post.userId))) {
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
  async findOneOfCurrentUserPost(id: string, user: User) {
    const post = await this.repo.findOneBy(ObjectId(id));
    if (!post || user.id !== post.userId) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  // for admins and supervisors
  async findOnePost(id: string, user: User) {
    const post = await this.repo.findOneBy(ObjectId(id));
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (user.roles === RoleEnum.user) {
      throw new UnauthorizedException('you are not allowed');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.repo.findOneBy(ObjectId(id));
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (!ObjectId(user.id).equals(ObjectId(post.userId))) {
      throw new UnauthorizedException('Unauthorized to edit this post');
    }
    post.title = updatePostDto.title;
    post.content = updatePostDto.content;
    post.approved = false;
    return this.repo.save(post);
  }

  async changeApproval(id: string, approved: boolean) {
    const post = await this.repo.findOneBy(ObjectId(id));
    if (!post) {
      throw new NotFoundException('post not found');
    }
    post.approved = approved;
    return this.repo.save(post);
  }

  async remove(id: string, user: User) {
    const post = await this.repo.findOneBy(ObjectId(id));
    if (!post) {
      throw new NotFoundException('post not found');
    }
    if (!ObjectId(user.id).equals(ObjectId(post.userId))) {
      throw new UnauthorizedException('Unauthorized to delete this post');
    }
    return this.repo.delete(id);
  }
}
