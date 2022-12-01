import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApprovePostDto {
  @ApiProperty()
  @IsBoolean()
  approved: boolean;
}
