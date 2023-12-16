import { WebSocketGateway } from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.FRONT_URL,
    credentials: true,
  },
})
export class ChatGateway {
  constructor() {}

  @WebSocketServer() private server: Server;

  sendChannelMessage(dataToSend: any) {
    this.server.emit('channelMessage', { data: dataToSend });
  }

  sendConversationMessage(dataToSend: any) {
    this.server.emit('conversationMessage', { data: dataToSend });
  }

  sendChannelData(dataToSend: any) {
    this.server.emit('channel', { data: dataToSend });
  }

  sendConversationData(dataToSend: any) {
    this.server.emit('conversation', { data: dataToSend });
  }

  sendDeleteConversationData(dataToSend: any) {
    this.server.emit('deleteConversation', { data: dataToSend });
  }
}
