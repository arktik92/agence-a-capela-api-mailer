import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './admin/dto/User';
import { Event } from './admin/dto/Event';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: "root",
      database: 'acap_db',
      entities: [User, Event],
      synchronize: true 
    }),
    MailModule,
    AdminModule
  ],
  controllers: [AppController]
})
export class AppModule {}
