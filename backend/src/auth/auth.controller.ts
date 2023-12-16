import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
  ParseIntPipe,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guards/ft.guard';
import { Request, Response } from 'express';
import { jwtConstants } from './auth.constants';
import { JwtGuard } from './guards/jwt.guard';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { userIdDto } from 'src/users/dto/creatuserDto';
import { PrismaClient } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends PrismaClient {
  constructor(private authService: AuthService) {
    super();
  }

  @ApiOperation({
    summary:
      "Initialize the 42 intra authentication process and set 'status' to 'online'.",
  })
  @Get('login')
  @UseGuards(FtGuard)
  initOauth(@Req() request: Request) { }

  @ApiExcludeEndpoint()
  @Get('signin')
  @UseGuards(FtGuard)
  async generateTokens(@Req() req: Request, @Res() response: Response) {
    try {
      if (!req['user']) throw new UnauthorizedException();
      await this.authService.signInLogic(req, response);
    } catch (error) {
      if (error?.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }

  @ApiOperation({ summary: 'Get a new access token.' })
  @Get('refresh')
  async getNewAccessToken(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req?.cookies?.refresh_token;

      await this.authService.isTokenValid(refreshToken, jwtConstants.rtSecret);
      const payload = this.authService.decodeToken(refreshToken);
      const { id } = payload;
      const newAccessToken = await this.authService.generateAccessToken({ id });

      const user = await this.user.findUnique({
        where : {
          id : payload.id
        }
      });``
        
      return res.json({ accessToken: newAccessToken, user: { id } });
    } catch (error) {
      if (error?.status) return res.status(error.status).json(error);
      return res.status(500).json(error);
    }
  }

  @Post('logout')
  @ApiOperation({ summary: "Delete jwt tokens and set 'status' to 'offline'." })
  @ApiBody({ type: userIdDto })
  @UseGuards(JwtGuard)
  async logout(
    @Req() request: Request,
    @Res() response: Response,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    try {
      const updatedUser = await this.authService.updateUserData(
        { id: userId },
        {
          is_otp_validated: false,
          status: 'offline',
        },
      );

      if (!updatedUser)
        throw new NotFoundException('User to update not found.');
      if (request?.cookies?.refresh_token)
        this.authService.removeCookie(response, 'refresh_token', {
          expires: new Date(0),
          sameSite: 'none',
          secure: true,
        });
      return response.json({ is_otp_validated: false });
    } catch (error) {
      if (error?.status) return response.status(error.status).json(error);
      return response.status(500).json(error);
    }
  }
}
