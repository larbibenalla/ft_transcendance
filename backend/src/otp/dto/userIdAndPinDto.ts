import { ApiProperty } from "@nestjs/swagger";

export class userIdAndPinDto {

	@ApiProperty({ example : "1" })
	userId : number;

	@ApiProperty({ example : "132412" })
	userPin : string
}