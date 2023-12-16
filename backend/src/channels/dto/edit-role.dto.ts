import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class EditRoleDto {

	@IsString()
	@IsNotEmpty()
	@IsIn(['admin', 'member'])
	@ApiProperty({example : 'admin'})
	role : string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({example : 'username'})
	username : string
}