import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(createUserDto.password);
    createUserDto.password = hashedPassword;

    try {
      const newUser = await this.usersService.create(createUserDto);
      return newUser;
    } catch {
      throw new ConflictException('Email in use');
    }
  }

  async signin(authUserDto: CreateUserDto): Promise<User> {
    const { email, password } = authUserDto;

    const user = await this.usersService.find(email);
    if (!user || !(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
