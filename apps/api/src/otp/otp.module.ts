import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import Redis from 'ioredis';

@Module({
  controllers: [OtpController],
  providers: [
    OtpService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => new Redis(), // defaults to localhost:6379
    },
  ],
  exports: [OtpService],
})
export class OtpModule {}
