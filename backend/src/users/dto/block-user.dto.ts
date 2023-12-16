import { IsNumber } from "class-validator";

export class BlockUserDto {
	@IsNumber()
	blockedUserId: number
}