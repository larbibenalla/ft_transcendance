import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameService extends PrismaClient {
	constructor(private readonly userService: UsersService) {
		super();
	}

	async createGame(data: any) {
		const game = await this.game.create({
			data,
		});

		if (!game)
			throw new InternalServerErrorException('Could not create a new game.');
		return game;
	}

	async findOneById(id_game: string) {
		const game = await this.game.findUnique({
			where: { id: parseInt(id_game, 10) },
		});
		if (!game) {
			throw new NotFoundException('Game not found.');
		}
		return game;
	}

	async updatGameEnd({
		gameId,
		id_winer,
		status,
		player_one_score,
		player_two_score,
	}: {
		gameId: number;
		id_winer: number;
		status: string;
		player_one_score: number;
		player_two_score: number;
	}) {
		if (id_winer) {
			const game = await this.game.update({
				where: { id: gameId },
				data: {
					id_winer: id_winer,
					status: status,
					player_one_score: player_one_score,
					player_two_score: player_two_score,
				},
			});
			if (!game) {
				throw new NotFoundException(`Game with id ${gameId} not found`);
			}
		}
		const game = await this.game.findUnique({
			where: { id: gameId },
		});
		return game;
	}

	async updateUserGameStatus(userId: number, status: string) {
		const user = await this.userService.user.update({
			where: { id: userId },
			data: {
				status: status,
			},
		});

		if (!user) throw new NotFoundException('User to update not found.');
		return user;
	}

	async updatePlayerLostGames(userId: number) {
		return await this.user.update({
			where: {
				id: userId,
			},
			data: {
				LostGames: {
					increment: 1,
				},
			},
		});;
	}

	async updatePlayerAchievements(userId: number, badgeUrl: string, lvl: number) {
		const user = await this.user.update({
			where: {
				id: userId,
			},
			data: {
				achievements: {
					push: badgeUrl,
				},
				level: lvl,
			},
		});
		return user;
	}

	async updatePlayerWinGames(userId: number) {
		const { WonGames } = await this.user.update({
			where: {
				id: userId,
			},
			data: {
				WonGames: {
					increment: 1,
				},
			},
		});
		if (WonGames === 3) {
			await this.updatePlayerAchievements(
				userId,
				'https://res.cloudinary.com/dsejzhuix/image/upload/v1699301531/badges/Bronze.webp',
				1,
			);

		} else if (WonGames === 5) {
			await this.updatePlayerAchievements(
				userId,
				'https://res.cloudinary.com/dsejzhuix/image/upload/v1699301531/badges/Silver.webp',
				2,
			);

		} else if (WonGames === 10) {
			await this.updatePlayerAchievements(
				userId,
				'https://res.cloudinary.com/dsejzhuix/image/upload/v1699301531/badges/Gold.webp',
				3,
			);
		}
		return false;
	}

	async getPlayerAchievements(userId: number) {
		const user = await this.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException(`User with id ${userId} not found`);
		}
		return user.achievements;
	}

	async findAllGames() {
		return await this.game.findMany();
	}

	//get the user status from the database
	async getUserStatus(userId: number) {
		const user = await this.userService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException(`User not found.`);
		}
		return user.status;
	}

	async getUserById(userId: number) {
		const user = await this.userService.user.findUnique({
			where: { id: userId },
		});
		return user;
	}
}
