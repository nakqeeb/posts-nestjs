import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  user: User;
}
