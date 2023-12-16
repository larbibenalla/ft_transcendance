import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateConversationDto {

	@ApiProperty({example : 1})
	@IsNumber()
	firstMember : number;

	@ApiProperty({example : 2})
	@IsNumber()
	secondMember : number;

	@ApiProperty({example : "date here"})
	@Transform(({ value }) => new Date(value))
	@IsDate()
	lastMessageCreatedAt : Date

	@ApiProperty({example : "your message here"})
	@IsString()
	lastMessageContent : string

	@ApiProperty({example : "550e8400-e29b-41d4-a716-446655440000"})
	@IsNotEmpty()
	@IsString()
	id : string;
}