// apps/api/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService : OtpService,
  ) {}

  async register(registerDto: any) {
    // Check if user with email or phone already exists
    const existingUser = await this.usersService.findByEmailOrPhone(
      registerDto.email,
      registerDto.phoneNumber,
    );

    if (existingUser) {
      if (existingUser.email === registerDto.email) {
        throw new BadRequestException('Email already registered');
      }
      if (existingUser.phoneNumber === registerDto.phoneNumber) {
        throw new BadRequestException('Phone number already registered');
      }
    }

    // Create new user
    const user = await this.usersService.create(registerDto);
    return { message: 'User registered successfully' };
  }

  async requestOtp(requestOtpDto: { phoneNumber: string }) {
    const { phoneNumber } = requestOtpDto;
    
    // Find user by phone number
    const user = await this.usersService.findByPhone(phoneNumber);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    console.log('User Exists:', user);
    
    const response = await this.otpService.sendOtp(phoneNumber);

    if (!response.success) {
      throw new BadRequestException('Failed to send OTP');
    }
    // return otp in dev mode
    if (
      this.configService.get<string>('NODE_ENV') === 'development' &&
      'otp' in response
    ) {
      return {
        message: 'OTP sent (development mode)',
        otp: (response as any).otp,
      };
    }

    return {message: `OTP sent successfully. ${response.message}`  };
    
  }

  async verifyOtp(verifyOtpDto: { phoneNumber: string, otp: string }) {
    const { phoneNumber, otp } = verifyOtpDto;
    
    // Find user by phone number
    const user = await this.usersService.findByPhone(phoneNumber);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // Verify OTP using in-house REDIS/AT service
    const valid = await this.otpService.verifyOtp(phoneNumber, otp);
    if (!valid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    
    // Generate JWT token
    const payload = { sub: user.id, phone: user.phoneNumber };
    const token = this.jwtService.sign(payload);
    
    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    };
  }
}