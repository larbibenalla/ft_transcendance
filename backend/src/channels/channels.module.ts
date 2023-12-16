import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService, ChatGateway],
})
export class ChannelsModule {}
