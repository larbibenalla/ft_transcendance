import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({example : "35a6393a-e53a-458b-9334-936abac9b8cf"})
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({example : "cafb1240-53a4-4d6a-bba1-af91ad006e34"})
  @IsString()
  @IsOptional()
  conversationId: string;

  @ApiProperty({example : "message"})
  @IsString()
  type: string;

  @ApiProperty({example : 1})
  @IsNumber()
  senderId: number;

  @ApiProperty({example : 2})
  @IsNumber()
  receiverId: number;
}