import { Expose } from 'class-transformer';

export class PostDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  approved: boolean;

  @Expose()
  userId: number;
}
