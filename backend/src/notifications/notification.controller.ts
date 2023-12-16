import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/createNotificationDto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new notification.' })
  @UseGuards(JwtGuard)
  @ApiBody({type : CreateNotificationDto})
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @Res() res: Response,
  ) {
    try {
      return res
        .status(200)
        .json(
          await this.notificationService.createNotification(
            createNotificationDto,
          ),
        );
    } catch (error) {
      return res.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications.' })
  @UseGuards(JwtGuard)
  async getNotifications(@Res() res: Response) {
    try {
      return res
        .status(200)
        .json(await this.notificationService.getNotifications());
    } catch (error) {
      return res.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification by id.' })
  @ApiParam({ name: 'id', type: String })
  @UseGuards(JwtGuard)
  async deleteNotification(@Param('id') id: string, @Res() res: Response) {
    try {
      return res
        .status(200)
        .json(await this.notificationService.deleteNotification(id));
    } catch (error) {
      return res.status(error?.status ? error.status : 500).json(error);
    }
  }
}
