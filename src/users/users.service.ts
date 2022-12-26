import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(name: string, email: string, password: string) {
    return this.prisma.user.create({ data: { name, email, password } });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.prisma.user.findUnique({ where: { id } });
  }

  find(email: string) {
    return this.prisma.user.findMany({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.prisma.user.update({ where: { id }, data: attrs });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.prisma.user.delete({ where: { id } });
  }
}
