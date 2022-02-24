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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { Serialize } from 'interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN } from './constants';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './jwt-authentication.guard';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const user = await this.authService.signup(createUserDto);
    const token = this.authService.getJwtToken(user.id);

    // TODO set expiration time
    res.cookie('access-token', token, { httpOnly: true, domain: 'localhost' });

    return user;
  }

  @Post('/signin')
  async signinUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const user = await this.authService.signin(createUserDto);
    const token = this.authService.getJwtToken(user.id);

    // TODO set expiration time
    res.cookie(ACCESS_TOKEN, token, { httpOnly: true, domain: 'localhost' });

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  whoAmI(@Req() req, @GetUser() user) {
    console.log(req);
    console.log('user', user);
    return 'hi';
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
