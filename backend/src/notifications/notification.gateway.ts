import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: process.env.FRONT_URL,
    credentials: true,
  },
})
export class NotificationGateway {
  constructor() {}

  @WebSocketServer() private server: Server;

  sendNotification(dataToSend: any) {
    this.server.emit('notification', { data: dataToSend });
  }
}
