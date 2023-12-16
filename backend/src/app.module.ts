import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { ChannelsModule } from './channels/channels.module';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat/chat.gateway';
import { NotificationModule } from './notifications/notification.module';
import { NotificationGateway } from './notifications/notification.gateway';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    OtpModule,
    ChannelsModule,
    UsersModule,
    ChatGateway,
    NotificationModule,
    NotificationGateway,
    GameModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
