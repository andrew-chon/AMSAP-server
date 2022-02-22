import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    AuthService,
    // If I want to globally scoped interceptor
    // { useClass: CurrentUserInterceptor, provide: APP_INTERCEPTOR },
  ],
})
export class UsersModule {}
