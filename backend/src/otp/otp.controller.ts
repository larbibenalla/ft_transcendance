import { Controller, ParseIntPipe, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { UseGuards, Post, Body } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Response } from 'express';
import { userIdDto } from 'src/users/dto/creatuserDto';
import { userIdAndPinDto } from './dto/userIdAndPinDto';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @ApiOperation({ summary: 'Generate a new otp secret and set it in the db.' })
  @ApiBody({ type: userIdDto })
  @Post('generate')
  @UseGuards(JwtGuard)
  async generateOtpSecret(
    @Body('userId', ParseIntPipe) userId: number,
    @Res() response: Response,
  ) {
    try {
      const user = await this.otpService.findUser({ id: userId });
      const secret = this.otpService.generateOtpSecret();
      const otpURL = this.otpService.generateOtpUrl(secret, user.username);
      await this.otpService.updateUserData(
        { id: userId },
        { otp_secret: secret },
      );

      return response.json({ otpAuthUrl: otpURL });
    } catch (error) {
      return response.status(404).json(error);
    }
  }

  @ApiOperation({
    summary: "Check if the pin is valid and update 'is_otp_enabled' to true.",
  })
  @ApiBody({ type: userIdAndPinDto })
  @Post('verify')
  @UseGuards(JwtGuard)
  async verifyOtp(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('userPin') userPin: string,
    @Res() response: Response,
  ) {
    try {
      const user = await this.otpService.findUser({ id: userId });
      const isValid = this.otpService.verifyTwoFaCode(userPin, user.otp_secret);

      if (isValid) {
        const updatedUser = await this.otpService.updateUserData(
          { id: userId },
          { is_otp_enabled: true, is_otp_validated: true },
        );
        return response.json(updatedUser);
      }
      return response.status(403).json({ verified: false });
    } catch (error) {
      return response.status(404).json(error);
    }
  }

  @Post('validate')
  @ApiOperation({
    summary: "Check if the pin is valid and update 'is_otp_validated' to true.",
  })
  @ApiBody({ type: userIdAndPinDto })
  @UseGuards(JwtGuard)
  async validateOtp(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('userPin') userPin: string,
    @Res() response: Response,
  ) {
    try {
      const user = await this.otpService.findUser({ id: userId });
      const isValid = this.otpService.verifyTwoFaCode(userPin, user.otp_secret);

      if (isValid) {
        const updatedUser = await this.otpService.updateUserData(
          { id: userId },
          { is_otp_validated: true },
        );
        return response.json(updatedUser);
      }
      return response.status(403).json({ validated: false });
    } catch (error) {
      return response.status(404).json(error);
    }
  }

  @Post('disable')
  @ApiOperation({
    summary: "Set 'is_otp_enabled' and 'is_otp_validated' to false.",
  })
  @ApiBody({ type: userIdDto })
  @UseGuards(JwtGuard)
  async disableOtp(
    @Body('userId', ParseIntPipe) userId: number,
    @Res() response: Response,
  ) {
    try {
      const updatedUser = await this.otpService.updateUserData(
        { id: userId },
        {
          is_otp_enabled: false,
          otp_secret: null,
          is_otp_validated: false,
        },
      );

      return response.json(updatedUser);
    } catch (error) {
      return response.status(404).json(error);
    }
  }
}
