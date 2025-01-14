import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MailModule
  ],
  controllers: [AppController]
})
export class AppModule {}