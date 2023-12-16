import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { UsersModule } from 'src/users/users.module';
import { MatchmakingGateway } from './matchmaking.gateway';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
	controllers: [GameController],
	providers: [GameGateway, MatchmakingGateway, GameService],
	imports: [UsersModule],
})
export class GameModule { }
