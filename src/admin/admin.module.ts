import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './dto/User';
import { Event } from './dto/Event';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
