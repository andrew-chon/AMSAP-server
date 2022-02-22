import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Serialize } from 'interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signup(createUserDto);
    session.userId = user.id;
    return user;
  }

  // TODO change dto?
  @Post('/signin')
  async signinUser(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signin(createUserDto);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('whoami')
  whoAmI(@CurrentUser() user: any) {
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID:${id} not found`);
    }

    return user;
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch('/:id')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
