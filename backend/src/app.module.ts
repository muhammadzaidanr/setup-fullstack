import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoutinesModule } from './routines/routines.module';

@Module({
  imports: [PrismaModule, RoutinesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}