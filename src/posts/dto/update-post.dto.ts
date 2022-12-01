import { PartialType } from '@nestjs/mapped-types';
import { IsString, MinLength } from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  content: string;
}
