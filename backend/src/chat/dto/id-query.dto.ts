import { IsNotEmpty, IsString } from "class-validator";

export class IdQueryDto 
{
	@IsString()
	@IsNotEmpty()
	id : string
}