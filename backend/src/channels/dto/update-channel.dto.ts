import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateChannelDto {

	@ApiPropertyOptional({example : "channelName"})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name : string

	@ApiPropertyOptional({example : "private/public/protected"})
	@IsIn(['private', 'protected', 'public'])
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	privacy : string

	@ApiPropertyOptional({example : "password"})
	@IsOptional()
	@IsString()
	password : string

	@ApiPropertyOptional({example : "channelDescription"})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	description : string

}
