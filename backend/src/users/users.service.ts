import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaClient } from '@prisma/client';
import { BlockUserDto } from './dto/block-user.dto';
@Injectable()
export class UsersService extends PrismaClient {
  constructor(private cloudinaryService: CloudinaryService) {
    super();
  }

  async findAllUsers() {
    try {
      const users = await this.user.findMany({
        select: {
          id: true,
          username: true,
          avatar: true,
          name: true,
        },
      });
      return users;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async findOneById(id: string) {
    const user = await this.user.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async findByEmail(emails: string) {
    const user = await this.user.findUnique({
      where: {
        email: emails,
      },
    });

    if (!user)
      throw new NotFoundException('user not found');

    return user;
  }

  async updateUserDetails(
    userId: number,
    username: string,
    avatar: Express.Multer.File,
  ) {
    if (!username && !avatar) {
      throw new HttpException(
        'You must provide either username or avatar',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (username) {
      const userWithUsername = await this.user.findUnique({
        where: { username },
      });
      if (userWithUsername) {
        throw new HttpException(
          'Username already exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.user.update({
        where: { id: userId },
        data: {
          username,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
    }
    if (avatar) {
      const rest = await this.cloudinaryService.uploadImage(avatar);
      const avatarUrl = rest.secure_url;
      const user = await this.user.update({
        where: { id: userId },
        data: {
          avatar: avatarUrl,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
    }
    const user = await this.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async getCurrentUser(userId: number) {
    try {
      const user = await this.user.findUnique({
        where: { id: parseInt(userId.toString(), 10) },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async acceptGameChallenge(userId: number) {
    try {
      const user = await this.user.findUnique({
        where: { id: parseInt(userId.toString(), 10) },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      return user.status;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getFriends(userId: number) {
    const user = await this.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const friendsIds = user.friends;
    const friends = await this.user.findMany({
      where: {
        id: {
          in: friendsIds,
        },
      },
    });
    return friends;
  }

  async addFriend(_id: number, _friendId: number) {
    const id = parseInt(_id.toString(), 10);
    const friendId = parseInt(_friendId.toString(), 10);

    const user = await this.user.findUnique({
      where: { id },
    });
    const friend = await this.user.findUnique({
      where: { id: friendId },
    });
    if (!user || !friend) {
      throw new NotFoundException(`User or friend not found`);
    }

    const currentUser = await this.user.update({
      where: { id },
      data: {
        friends: [...user.friends, friendId],
      },
    });
    await this.user.update({
      where: { id: friendId },
      data: {
        friends: [...friend.friends, id],
      },
    });

    return currentUser;
  }
  async deleteFriend(id: number, friendId: number) {
    const user = await this.user.findUnique({
      where: { id },
    });
    const friend = await this.user.findUnique({
      where: { id: friendId },
    });
    if (!user || !friend) {
      throw new NotFoundException(`User or friend not found`);
    }

    const currentUser = await this.user.update({
      where: { id },
      data: {
        friends: user.friends.filter((id) => id !== friendId),
      },
    });
    await this.user.update({
      where: { id: friendId },
      data: {
        friends: friend.friends.filter((id) => id !== id),
      },
    });

    return currentUser;
  }

  async updateUserData(userId: number) {
    const user = await this.user.update({
      where: { id: userId },
      data: {
        is_profile_completed: true,
      },
    });

    if (!user) throw new NotFoundException();
    return user;
  }

  async getLeaderboard() {
    const users = await this.user.findMany({
      orderBy: {
        level: 'desc',
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        level: true,
      },
    });
    if (users?.length === 0)
        return [];
    return users;
  }
  async getRecentGames(userId: number) {
    const user = await this.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatar: true,
        name: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const games = await this.game.findMany({
      where: {
        OR: [
          {
            player_one_id: userId,
          },
          {
            player_two_id: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const formattedGames = await Promise.all(
      games.map(async (game) => {
        const playerOne = await this.user.findUnique({
          where: { id: game.player_one_id },
          select: {
            id: true,
            username: true,
            avatar: true,
            name: true,
          },
        });
        const playerTwo = await this.user.findUnique({
          where: { id: game.player_two_id },
          select: {
            id: true,
            username: true,
            avatar: true,
            name: true,
          },

        });
        return {
          id: game.id,
          playerOne: { ...playerOne, score: game.player_one_score },
          playerTwo: { ...playerTwo, score: game.player_two_score },
          status: game.status,
          winnerId: game.id_winer,
          createdAt: game.createdAt,
        };
      }),
    );
    return formattedGames;
  }


  async blockUser(blockUserDto: BlockUserDto, id: number) {
    const user = await this.user.findUnique({
      where: {
        id: id
      }
    });
    const toBlock = await this.user.findUnique({
      where: {
        id: blockUserDto.blockedUserId
      }
    });

    if (id == blockUserDto.blockedUserId)
      throw new BadRequestException('Can\'t block yourself.');
    if (!toBlock || !user)
      throw new NotFoundException(!toBlock ? "User to block not found." : "User not found.");
    if (user.blocked.find(id => id == toBlock.id))
      throw new BadRequestException('Already blocked.');

    user.blocked.push(toBlock.id);
    const updated = await this.user.update({
      where: {
        id: id,
      },
      data: {
        blocked: user.blocked,
      }
    })
    return updated;
  }

  async unblockUser(blockUserDto: BlockUserDto, id: number) {
    const user = await this.user.findUnique({
      where: {
        id: id
      }
    });

    const toUnblock = await this.user.findUnique({
      where: {
        id: blockUserDto.blockedUserId
      }
    });

    if (id == blockUserDto.blockedUserId)
      throw new BadRequestException('Can\'t unblock yourself.');
    if (!toUnblock || !user)
      throw new NotFoundException(!toUnblock ? "User to unblock not found." : "User not found.");
    let index = user.blocked.indexOf(toUnblock.id);

    if (index < 0)
      throw new BadRequestException('This user is not blocked.');
    user.blocked.splice(index, 1);

    const updated = await this.user.update({
      where: {
        id: id
      },
      data: {
        blocked: user.blocked
      }
    });

    return updated;
  }
}
