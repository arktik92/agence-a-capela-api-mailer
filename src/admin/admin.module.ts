import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './dto/User';
import { Event } from './dto/Event';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event]), JwtModule.register({})],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy]
})
export class AdminModule {}
