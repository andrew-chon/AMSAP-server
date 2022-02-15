import { Injectable } from '@nestjs/common';
import { User } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    return this.prisma.user.create({ data: createUserDto });
  }
}
