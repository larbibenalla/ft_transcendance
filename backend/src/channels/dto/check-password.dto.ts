import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional } from "class-validator";

export class CheckPasswordDto {

	@ApiProperty({name : 'password', example : 'password'})
	@IsString()
	@IsOptional()
	password : string

	@IsNumber()
	@ApiProperty({name : 'userId', example : 1})
	userId : number
}