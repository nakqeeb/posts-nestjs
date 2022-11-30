import { PostDto } from './dto/post.dto';
import { User } from './../users/entities/user.entity';
import { RoleEnum } from './../users/role.enum';
import { AuthGuard } from '@nestjs/passport';
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
import { ApproveReportDto } from './dto/approve-report.dto';
import { Roles } from 'src/users/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/users/auth/guards/roles.guard';
import { NoAuth } from 'src/users/auth/decorators/no-auth.decorator';
import { GetUser } from 'src/users/auth/decorators/get-user.decorator';
import { Serialize } from 'src/users/auth/interceptors/serialize.interceptor';

@Controller('posts')
@Serialize(PostDto)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @NoAuth()
  findAllApprovedPost() {
    return this.postsService.findAllApprovedPost();
  }

  @Get('/findone/:id')
  @NoAuth()
  findOneApprovedPost(@Param('id') id: string) {
    return this.postsService.findOneApprovedPost(+id);
  }

  @Get('/currentuser')
  findAllCurrentUserPosts(@GetUser() user: User) {
    return this.postsService.findAllCurrentUserPosts(user);
  }

  @Get('/findone/currentuser/:id')
  findOneOfCurrentUserPost(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.findOneOfCurrentUserPost(+id, user);
  }


  @Get('/admin')
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin, RoleEnum.supervisor) 
  findAllPosts(@GetUser() user: User) {
    return this.postsService.findAllPosts(user);
  }

  @Get('/admin/:id')
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin, RoleEnum.supervisor) 
  findOnePost(@Param('id')id: string, @GetUser() user: User) {
    return this.postsService.findOnePost(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @GetUser() user: User) {
    return this.postsService.update(+id, updatePostDto, user);
  }

  @Patch('/:id/approved')
  @UseGuards(RolesGuard) // AuthGuard/JwtAuthGuard will be executed first and then RolesGuard.
  @Roles(RoleEnum.admin, RoleEnum.supervisor) 
  approvePost(
    @Param('id') id: string,
    @Body() approveReportDto: ApproveReportDto,
  ) {
    return this.postsService.changeApproval(+id, approveReportDto.approved);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.postsService.remove(+id);
    return { message: 'post is deleted successfully' };
  }
}
