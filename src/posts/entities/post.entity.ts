import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
const ObjectId = require('mongodb').ObjectId;

@Entity()
export class Post {
  @ObjectIdColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  approved: boolean;

  @Column({type: ObjectId})
  userId: string;
}
