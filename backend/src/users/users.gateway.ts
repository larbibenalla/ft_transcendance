import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { PrismaClient } from '@prisma/client';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'user',
  cors: {
    origin: process.env.FRONT_URL,
    credentials: true,
  },
})
export class UserGateway
  extends PrismaClient
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private connectedUsers: Set<string> = new Set();

  async handleConnection(client: Socket, ...args: any[]) {
    const userId = client.handshake.query.userId as string;
    if (!this.connectedUsers.has(userId)) {
      await this.user
        .update({
          where: {
            id: parseInt(userId, 10),
          },
          data: {
            status: 'online',
          },
        })
        .catch((err) => {
        });
      this.connectedUsers.add(userId);
    }
    this.sendOnlineUsers(this.connectedUsers.size);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (this.connectedUsers.has(userId)) {
      await this.user
        .update({
          where: {
            id: parseInt(userId, 10),
          },
          data: {
            status: 'offline',
          },
        })
        .catch((err) => {
        });
      this.connectedUsers.delete(userId);
    }
    this.sendOnlineUsers(this.connectedUsers.size);
  }

  async sendOnlineUsers(dataToSend: any) {
    this.server.emit('onlineUsers', { data: dataToSend });
  }

  async sendToAllUsersThatNewUserIsOnline(dataToSend: any) {
    this.server.emit('newuser', {
      data: {
        id: dataToSend.id,
        username: dataToSend.username,
        avatar: dataToSend.avatar,
        name: dataToSend.name,
      }
    });
  }
}
