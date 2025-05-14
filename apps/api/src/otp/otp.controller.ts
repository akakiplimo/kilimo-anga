import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  sendOtp(@Body() dto: RequestOtpDto) {
    return this.otpService.sendOtp(dto.phone);
  }

  @Post('verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const valid = await this.otpService.verifyOtp(dto.phone, dto.code);
    return { valid };
  }
}
