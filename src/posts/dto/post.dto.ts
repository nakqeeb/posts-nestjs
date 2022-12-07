import { Expose, Transform } from 'class-transformer';

export class PostDto {
  @Expose()
  @Transform((from: any) => from.obj.id, { toClassOnly: true }) // to fix: ObjectID changes per serialization
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  approved: boolean;

  @Expose()
  @Transform((from: any) => from.obj.userId, { toClassOnly: true }) // to fix: ObjectID changes per serialization
  userId: string;
}
