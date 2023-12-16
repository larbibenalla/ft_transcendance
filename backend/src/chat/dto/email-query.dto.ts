import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmailQueryDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email : string
}

export class MembersQueryDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	member1 : string

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	member2 : string
}