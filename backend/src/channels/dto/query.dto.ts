import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class QueryDto {

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name : string;
}