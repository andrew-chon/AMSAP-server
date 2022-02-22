import { Prisma } from '@prisma/client';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30) // TODO add matches regex for password
  password: string;
}
