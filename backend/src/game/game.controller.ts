import { Body, Controller, Get, Param, Post, Logger, UseGuards, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GameService } from './game.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) { }

	private readonly logger = new Logger(Controller.name);

	@Get(':id')
	@UseGuards(JwtGuard)
	findOne(@Param('id') id: string, @Res() response : Response) {
		try {
			const game = this.gameService.findOneById(id);

			return response.status(200).json(game);
		}
		catch (error) {
			return response.status(error?.status ? error.status : 500).json(error);
		}
	}

	@Get()
	@UseGuards(JwtGuard)
	findAll(@Res() response : Response) {
		try {
			const allGames = this.gameService.findAllGames();

			return response.status(200).json(allGames);
		}
		catch (error) {
			return response.status(error?.status ? error.status : 500).json(error);
		}
	}

	@Post()
	@UseGuards(JwtGuard)
	updateUser(@Param('userid') userid: number, status: string, @Res() response : Response) {
		try {
			this.gameService.updateUserGameStatus(userid, status);

			return response.status(201).json({message : 'User has been updated.'});
		}
		catch (error) {
			return response.status(error?.status ? error?.status : 500).json(error);
		}
	}
}
