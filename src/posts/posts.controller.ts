import { ApprovePostDto } from './dto/approve-post.dto';
import { PostDto } from './dto/post.dto';
import { User } from './../users/entities/user.entity';
import { RoleEnum } from './../users/role.enum';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from 'src/users/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/users/auth/guards/roles.guard';
import { NoAuth } from 'src/users/auth/decorators/no-auth.decorator';
import { GetUser } from 'src/users/auth/decorators/get-user.decorator';
import { Serialize } from 'src/users/auth/interceptors/serialize.interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth') // This is the one that needs to match the name in main.ts
@ApiTags('Posts')
@Controller('posts')
@Serialize(PostDto)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary:
      'Create a post. Ex: {"title": "Test title", "content": "Test content"}',
  })
  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @ApiOperation({
    summary: 'Find all the approved posts by auth and non-auth usesrs.',
  })
  @Get()
  @NoAuth()
  findAllApprovedPost() {
    return this.postsService.findAllApprovedPost();
  }

  @ApiOperation({
    summary: 'Find one approved post by ID by auth and non-auth usesrs.',
  })
  @Get('/findone/:id')
  @NoAuth()
  findOneApprovedPost(@Param('id') id: string) {
    return this.postsService.findOneApprovedPost(id);
  }

  @ApiOperation({
    summary:
      'Find all the posts that owned by current logged-in user (approved or not approved).',
  })
  @Get('/currentuser')
  findAllCurrentUserPosts(@GetUser() user: User) {
    return this.postsService.findAllCurrentUserPosts(user);
  }

  @ApiOperation({
    summary:
      'Find one post by ID that owned by current logged-in user (approved or not approved).',
  })
  @Get('/findone/currentuser/:id')
  findOneOfCurrentUserPost(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.findOneOfCurrentUserPost(id, user);
  }

  @ApiOperation({
    summary:
      'Find all the posts by the admin and the users who have been ruled as a supervisor.',
  })
  @Get('/admin')
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin, RoleEnum.supervisor)
  findAllPosts(@GetUser() user: User) {
    return this.postsService.findAllPosts(user);
  }

  @ApiOperation({
    summary:
      'Find one post by ID by the admin and the users who have been ruled as a supervisor.',
  })
  @Get('/admin/:id')
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin, RoleEnum.supervisor)
  findOnePost(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.findOnePost(id, user);
  }

  @ApiOperation({
    summary: 'Update post by ID by the user who has created that post.',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @ApiOperation({
    summary: 'Approve an existing post by the admin & supervisor.',
  })
  @Patch('/:id/approved')
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin, RoleEnum.supervisor)
  approvePost(
    @Param('id') id: string,
    @Body() approvePostDto: ApprovePostDto,
  ) {
    return this.postsService.changeApproval(id, approvePostDto.approved);
  }

  @ApiOperation({
    summary: 'Delete an existing post by the user who has created that post.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    await this.postsService.remove(id, user);
    return { message: 'post is deleted successfully' };
  }
}