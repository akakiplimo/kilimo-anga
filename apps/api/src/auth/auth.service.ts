// apps/api/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as twilio from 'twilio';

@Injectable()
export class AuthService {
  private twilioClient: twilio.Twilio;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Initialize Twilio client
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = twilio(accountSid, authToken);
  }

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

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry to 5 minutes from now
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    
    // Save OTP to user document
    await this.usersService.updateOtp(user.id as string, otp, otpExpiry);
    
    // Send OTP via SMS using Twilio
    try {
      const twilioPhoneNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');
      
      // Format the phone number (add country code if needed)
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+254${phoneNumber.replace(/^0/, '')}`;
      
      await this.twilioClient.messages.create({
        body: `Your Kilimo Anga verification code is: ${otp}. Valid for 5 minutes.`,
        from: twilioPhoneNumber,
        to: formattedPhone,
      });
      
      return { message: 'OTP sent successfully' };
    } catch (error) {
      // In case of SMS sending error, still return success but log the error
      console.error('Failed to send OTP via SMS:', error);
      
      // For development environments, return the OTP in the response
      if (this.configService.get<string>('NODE_ENV') === 'development') {
        return { 
          message: 'OTP generated successfully (SMS sending failed)',
          otp, // Only include in development!
        };
      }
      
      return { message: 'OTP sent successfully' };
    }
  }

  async verifyOtp(verifyOtpDto: { phoneNumber: string, otp: string }) {
    const { phoneNumber, otp } = verifyOtpDto;
    
    // Find user by phone number
    const user = await this.usersService.findByPhone(phoneNumber);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    
    if (new Date() > user.otpExpiry) {
      throw new UnauthorizedException('OTP expired');
    }
    
    // Clear OTP after successful verification
    await this.usersService.clearOtp(user.id as string);
    
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