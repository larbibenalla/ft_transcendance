import {
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Delete,
  Body,
  Res,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, response, Response } from 'express';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { userIdDto } from './dto/creatuserDto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PrismaClient } from '@prisma/client';
import { BlockUserDto } from './dto/block-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController extends PrismaClient {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Get()
  @ApiOperation({summary : 'Get all users.'})
  @UseGuards(JwtGuard)
  async findAll(@Res() response : Response) {
    try {
      const allUsers = await this.usersService.findAllUsers();
      
      return response.status(200).json(allUsers);
    }
    catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Get('user/:id')
  @ApiOperation({summary : 'Get a single user by id.'})
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string, @Res() response : Response) {
    try {
      const user = await this.usersService.findOneById(id);
      
      return response.status(200).json(user);
    }
    catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Get('username/:username')
  @ApiOperation({summary : 'Get a single user by username.'})
  @UseGuards(JwtGuard)
  async getUserByUsername(@Param('username') username: string, @Res() response : Response) {
    try {
      const user = await this.usersService.findByUsername(username);
      
      return response.status(200).json(user);
    }
    catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Get('email/:email')
  @ApiOperation({summary : 'Get a single user by mail.'})
  @UseGuards(JwtGuard)
  async getBlocked(@Param('email') email: string, @Res() response : Response) {
    try {
      const user = await this.usersService.findByEmail(email);

      return response.status(200).json(user);
    }
    catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Get('currentuser/:id')
  @ApiOperation({summary : 'Get current user.'})
  @UseGuards(JwtGuard)
  async getCurrentUser(@Param('id') userId: number, @Res() response : Response) {
    try {
      const user = await this.usersService.getCurrentUser(userId);

      return response.status(200).json(user);
    }
    catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }


  @Post(':id/challenge/accept')
  @ApiOperation({summary : 'Challenge user.'})
  @UseGuards(JwtGuard)
  async acceptGameChallenge(@Param('id') userId: number, @Res() response : Response) {
    try {
      const status = await this.usersService.acceptGameChallenge(userId);

      return response.status(200).json(status);
    }
    catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Patch(':id/settings')
  @ApiOperation({summary : 'Update user settings.'})
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserDetails(
    @Param('id', ParseIntPipe) userId: number,
    @Body('username') username: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Res() response : Response
  ) {
    try {
      const user = await this.usersService.updateUserDetails(
        userId,
        username,
        avatar,
      );
      return response.status(200).json(user);
    } catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Get(':id/friends')
  @ApiOperation({summary : 'Get a list of friends of a specific user.'})
  @UseGuards(JwtGuard)
  async getFriends(@Param('id') id: string, @Res() response : Response) {
    try {
      const userId = Number(id);
      const friends = await this.usersService.getFriends(userId);

      return response.status(200).json(friends);
    }
    catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Post(':id/friends')
  @ApiOperation({summary : 'Add a user to the friend\'s list.'})
  @UseGuards(JwtGuard)
  async addFriend(@Param('id') id: string, @Body('friendId') friendId: number, @Res() response : Response) {
    try {
      const userId = Number(id);
      const current = await this.usersService.addFriend(userId, friendId);

      return response.status(201).json(current);
    }
    catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Delete(':id/friends/:friendId')
  @ApiOperation({summary : 'Remove a user from friend\' list.'})
  @UseGuards(JwtGuard)
  async deleteFriend(@Param('id') id: number, @Param('friendId') friendId: number, @Res() response : Response) {
    try {
      const userId = Number(id);
      const friendIdNumber = Number(friendId);
      const currentUser = await this.usersService.deleteFriend(userId, friendIdNumber);

      return response.status(200).json(currentUser);
    }
    catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @ApiBody({ type: userIdDto })
  @ApiOperation({ summary: "Set 'is_profile_completed' to true." })
  @Post('profile-check-completed')
  @UseGuards(JwtGuard)
  async updateProfileCheck(
    @Body('userId', ParseIntPipe) userId: number,
    @Res() response: Response,
  ) {
    try {
      const user = await this.usersService.updateUserData(userId);

      return response.status(200).json(user);
    } catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }
  @ApiOperation({ summary: 'Get leaderboard.' })
  @UseGuards(JwtGuard)
  @Get('leaderboard')
  async getLeaderboard(@Res() response: Response) {
    try {
      const leaderboard = await this.usersService.getLeaderboard();
      
      return response.status(200).json(leaderboard);
    } catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }
  @ApiOperation({ summary: 'Get recent games.' })
  @UseGuards(JwtGuard)
  @Get(':userId/recentgames')
  async getRecentGames(@Param('userId', ParseIntPipe) userId: number, @Res() response : Response) {
    try {
      const allGames = await this.usersService.getRecentGames(userId);

      return response.status(200).json(allGames);
    } catch (error) {
      return response.status(error?.status ? error.status : 500).json(error);
    }
  }

  @Patch(':id/blockuser')
  @ApiOperation({summary : 'Block a user.'})
  @UseGuards(JwtGuard)
  async blockUser(@Res() response: Response, @Body() blockUserDto: BlockUserDto, @Param("id", ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.blockUser(blockUserDto, id);
      return response.status(200).json(user)
    }
    catch (error) {
      return error.status ? response.status(error.status).json(error) : response.status(500).json(error);
    }
  }


  @Patch(':id/unblockuser')
  @ApiOperation({summary : 'Unblock a user.'})
  @UseGuards(JwtGuard)
  async unblockUser(@Res() response: Response, @Body() blockUserDto: BlockUserDto, @Param("id", ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.unblockUser(blockUserDto, id);
      return response.status(200).json(user)
    }
    catch (error) {
      return error.status ? response.status(error.status).json(error) : response.status(500).json(error);
    }
  }
}