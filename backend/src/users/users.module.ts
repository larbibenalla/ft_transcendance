import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { UserGateway } from './users.gateway';

@Module({
  imports: [
    CloudinaryModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryProvider, CloudinaryService, UserGateway],
  exports: [UsersService],
})
export class UsersModule { }
