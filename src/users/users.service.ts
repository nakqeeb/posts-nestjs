import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
const ObjectId = require('mongodb').ObjectId; // to convert string to ObjectId

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: MongoRepository<User>) {}

  create(name: string, email: string, password: string) {
    const user = this.repo.create({ name, email, password });
    return this.repo.save(user);
  }

  async findAll() {
    const users = await this.repo.find();
    if (!users) {
      throw new NotFoundException('no users found');
    }
    // console.log(users[0]);
    return users;
  }

   findOne(id: string) {
    if (!id) {
      return null;
    }
   return  this.repo.findOneBy( ObjectId(id));
  }

  find(email: string) {
    return this.repo.findBy({ email });
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}