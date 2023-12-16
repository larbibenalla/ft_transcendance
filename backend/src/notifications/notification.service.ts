import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateNotificationDto } from './dto/createNotificationDto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService extends PrismaClient {
  constructor(private webSocketGateway: NotificationGateway) {
    super();
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const sender = await this.user.findUnique({
      where: { id: createNotificationDto.senderId },
    });
    const receiver = await this.user.findUnique({
      where: { id: createNotificationDto.receiverId },
    });

    if (!sender || !receiver)
      throw new NotFoundException(
        !sender ? 'Sender not found.' : 'Receiver not found.',
      );
    if (createNotificationDto.type === 'friendRequest') {
      if (sender.friends.includes(receiver.id)) {
        throw new BadRequestException(
          'You cannot send a friend request to an existing friend.',
        );
      }
    }
    if (createNotificationDto.type === 'gameRequest') {
      if (receiver.blocked.includes(sender.id)) {
        throw new BadRequestException(
          'You cannot send a game request to a player who is already blocking you.',
        );
      }
      if (receiver.status === 'playing') {
        throw new BadRequestException(
          'You cannot send a game request to a player who is already playing.',
        );
      }
    }

    if (createNotificationDto.type !== 'conversation') {
      const existingNotification = await this.notification.findFirst({
        where: {
          senderId: createNotificationDto.senderId,
          receiverId: createNotificationDto.receiverId,
          type: createNotificationDto.type,
        },
      });
      if (existingNotification && existingNotification.type === 'friendRequest') {
        throw new BadRequestException(
          'You have already sent a friend request to this user.',
        );
      }
      if (existingNotification && existingNotification.type === 'gameRequest') {
        throw new BadRequestException(
          'You have already sent a game request to this user.',
        );
      }
    }
    const newNotification = await this.notification.create({
      data: createNotificationDto,
    });
    if (!newNotification)
      throw new BadRequestException('Could not create a new notification.');

    this.webSocketGateway.sendNotification({
      id: newNotification.id,
      conversationId: newNotification.conversationId,
      type: newNotification.type,
      sender: {
        id: sender.id,
        name: sender.name,
      },
      receiverId: newNotification.receiverId,
      createdAt: newNotification.createdAt,
    });
    return newNotification;
  }

  async getNotifications() {
    const notifications = await this.notification.findMany();
    if (notifications.length === 0) {
      return [];
    }
    const formattedNotifications = await Promise.all(
      notifications.map(async (notification) => ({
        id: notification.id,
        conversationId: notification.conversationId,
        type: notification.type,
        sender: await this.user
          .findUnique({
            where: { id: notification.senderId },
          })
          .then((user) => ({
            id: user.id,
            name: user.name,
          })),
        receiverId: notification.receiverId,
        createdAt: notification.createdAt,
      })),
    );
    return formattedNotifications;
  }

  async deleteNotification(id: string) {
    const notification = await this.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    await this.notification.delete({
      where: { id },
    });
    return 'Notification deleted';
  }
}
