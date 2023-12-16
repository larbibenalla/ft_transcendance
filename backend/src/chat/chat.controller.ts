import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDataDto } from './dto/create-message-data.dto';
import { EmailQueryDto, MembersQueryDto } from './dto/email-query.dto';
import UpdateConversationDto from './dto/update-conversation.dto';
import { IdQueryDto } from './dto/id-query.dto';

@ApiTags('conversations')
@Controller('conversations')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('addmessage')
  @UseGuards(JwtGuard)
  @ApiBody({ type: CreateMessageDataDto })
  @ApiOperation({ summary: 'Create a new message.' })
  async createMessageData(
    @Body() createMessageDto: CreateMessageDataDto,
    @Res() response: Response,
  ) {
    try {
      await this.chatService.createMessageData(createMessageDto);

      return response.status(201).json({ message: 'Message data created.' });
    } catch (error) {
      if (error.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create a new conversation.' })
  @ApiBody({ type: CreateConversationDto })
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Res() response: Response,
  ) {
    try {
      const conversation = await this.chatService.createConversation(
        createConversationDto,
      );

      return response.status(200).json([conversation]);
    } catch (error) {
      if (error.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiQuery({ name: 'email' })
  @ApiOperation({ summary: 'Get conversations with a specified email.' })
  async getConversations(
    @Res() response: Response,
    @Query() emailQuery: EmailQueryDto,
  ) {
    try {
      const data = await this.chatService.getAllUserConversations(
        emailQuery.email,
      );

      return response.status(200).json(data);
    } catch (error) {
      if (error.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }

  @Get('conversation')
  @UseGuards(JwtGuard)
  @ApiQuery({ name: 'id' })
  @ApiOperation({ summary: 'Get a single conversation by id.' })
  async getConversation(
    @Res() response: Response,
    @Query() conversationId: IdQueryDto,
  ) {
    try {
      const data = await this.chatService.getConversation(conversationId.id);

      return response.status(200).json(data);
    } catch (error) {
      if (error.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }

  @Get('conversationByEmails')
  @UseGuards(JwtGuard)
  @ApiQuery({ name: 'member1', example: 'member1@gmail.com' })
  @ApiQuery({ name: 'member2', example: 'member2@gmail.com' })
  @ApiOperation({ summary: 'Get a single conversation by 2 emails.' })
  async getConversationByEmail(
    @Query() queryDto: MembersQueryDto,
    @Res() response: Response,
  ) {
    try {
      const data = await this.chatService.findConversationByEmails(
        queryDto.member1,
        queryDto.member2,
      );
      return response.status(200).json(data);
    } catch (error) {
      if (error.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }

  @Delete(':conversationId')
  @UseGuards(JwtGuard)
  @ApiProperty({ name: 'conversationId' })
  @ApiOperation({ summary: 'Delete a conversation by id.' })
  async deleteConversation(
    @Param('conversationId') id: string,
    @Res() response: Response,
  ) {
    try {
      const message = await this.chatService.deleteConversation(id);

      return response.status(200).json({
        message,
      });
    } catch (error) {
      if (error.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }

  @Patch()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update a conversation by id.' })
  @ApiBody({ type: UpdateConversationDto })
  async updateConversation(
    @Res() response: Response,
    @Body() updateDto: UpdateConversationDto,
  ) {
    try {
      await this.chatService.updateConversation(updateDto);

      return response.status(200).json({ message: 'Message updated.' });
    } catch (error) {
      if (error.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }

  @Get('messages')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get messages by conversation id.' })
  async getMessages(
    @Query('conversationId') conversationId: string,
    @Query('page', ParseIntPipe) page: number,
    @Res() response: Response,
  ) {
    try {
      const data = await this.chatService.getMessagesByConversationId(
        conversationId,
        page,
      );
      return response.status(200).json(data);
    } catch (error) {
      if (error.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }
}
