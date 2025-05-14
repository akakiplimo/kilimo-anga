import { Inject, Injectable } from '@nestjs/common';
import * as africastalking from 'africastalking';

const africasTalking = africastalking({
  apiKey: 'ATS_API_KEY',
  username: 'ATS_USERNAME',
});

const sms = africasTalking.SMS;

@Injectable()
export class OtpService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: any) {}

  private generateOTP(): string {
    console.log('Generating OTP');
    
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Format phone number to E.164 format
  private formatPhoneNumber(phone: string): string {
    // remove any spaces, dashes, or parentheses
    let cleaned = phone.replace(/\s+|-|\(|\)/g, '');

    // if no. starts with 0, replace it with country code
    if (cleaned.startsWith('0')) {
      cleaned = '+254' + cleaned.substring(1);
    }
    // if no. starts with 254 without +, add the +
    else if (cleaned.startsWith('254')) {
      cleaned = '+' + cleaned;
    }
    // if no. does not have a country code, add the +254
    else if (!cleaned.startsWith('+')) {
      cleaned = '+254' + cleaned;
    }

    return cleaned;
  }

  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    const otp = this.generateOTP();
    // Format the phone number to ensure it has the +254 prefix
    const formattedPhone = this.formatPhoneNumber(phone);
    const key = `otp:${formattedPhone}`;

    console.log(`Generated OTP: ${otp} for phone: ${formattedPhone}`);

    // Save to Redis with 5 min expiry
    try {
      await this.redisClient.set(key, otp, 'EX', 300);
    } catch (error) {
      console.error('Error saving OTP to Redis:', error);
      return { success: false, message: 'Failed to save OTP' };
    }

    // Send via SMS
    try {
      await sms.send({
        to: [formattedPhone],
        message: `Your OTP is ${otp}. It expires in 5 minutes.`,
      });
      return { success: true, message: 'OTP sent' };
    } catch (error) {
      return { success: false, message: 'Failed to send OTP' };
    }
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const formattedPhone = this.formatPhoneNumber(phone);
    const key = `otp:${formattedPhone}`;
    const storedOtp = await this.redisClient.get(key);
    if (storedOtp && storedOtp === code) {
      await this.redisClient.del(key); // invalidate after use
      return true;
    }
    return false;
  }
}
