import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, ValidateNested } from "class-validator";

class MessageDto {
	
	@IsString()
	@IsNotEmpty()
	@ApiProperty({name : 'lastMessageContent'})
	lastMessageContent : string

	@IsNotEmpty()
	@Transform(({ value }) => new Date(value))
	@IsDate()
	@ApiProperty({name : 'lastMessageCreatedAt'})
	lastMessageCreatedAt : Date
}

export default class UpdateConversationDto {

	@ApiProperty({example : '1'})
	@IsNotEmpty()
	@IsString()
	id : string;

	@ValidateNested()
	@IsNotEmptyObject()
	@Type(() => MessageDto)
	@ApiProperty({type : MessageDto})
	message : MessageDto;
}