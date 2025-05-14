// apps/api/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async findByEmailOrPhone(email: string, phoneNumber: string): Promise<User | null> {
    return this.userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    }).exec();
  }

  async updateOtp(userId: string, otp: string, otpExpiry: Date): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { otp, otpExpiry },
      { new: true },
    ).exec();
  }

  async clearOtp(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { otp: null, otpExpiry: null },
      { new: true },
    ).exec();
  }
}