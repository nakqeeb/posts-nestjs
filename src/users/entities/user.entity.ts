import { RoleEnum } from './../role.enum';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Exclude } from 'class-transformer';

@Entity({name: 'users'})
export class User {
  @ObjectIdColumn()
   id: ObjectID;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  activated: boolean;

  @Column({ default: RoleEnum.user })
  roles: RoleEnum;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  /* get id() : string{
    console.log(this._id);
    return this._id;
  } */

  /* @AfterInsert()
  logInsert() {
    console.log('Inserted User with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id ', this.id);
  } */
}
