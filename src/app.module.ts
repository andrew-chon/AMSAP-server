import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, ReportsModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
