import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

export class CreateChannelDto {

	@ApiProperty({
		example : "channelName"
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(15)
	name : string;


	@ApiProperty({
		example : "public/protected/private"
	})
	@IsString()
	@IsNotEmpty()
	@IsIn(['public', 'private', 'protected'])
	privacy : string;


	@ApiProperty({
		example : "password"
	})
	@ValidateIf(o => o.privacy === 'protected')
	@IsString()
	@IsNotEmpty()
	@MinLength(5,  {message : 'password must at least have 5 characters'})
	@MaxLength(20, {message : 'maximum characters allowed in password are 20'})
	password : string;


	@ApiProperty({
		example : "description"
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	description : string;

	ownerId : number
}
