// apps/api/src/farms/farms.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Farm, FarmDocument } from './entities/farm.entity';

@Injectable()
export class FarmsService {
  constructor(
    @InjectModel(Farm.name) private farmModel: Model<FarmDocument>,
  ) {}

  async create(userId: string, createFarmDto: any): Promise<Farm> {
    const createdFarm = new this.farmModel({
      ...createFarmDto,
      owner: new Types.ObjectId(userId),
    });
    return createdFarm.save();
  }

  async findAll(userId: string): Promise<Farm[]> {
    return this.farmModel.find({ owner: new Types.ObjectId(userId) }).exec();
  }

  async findOne(userId: string, id: string): Promise<Farm> {
    const farm = await this.farmModel.findOne({
      _id: new Types.ObjectId(id),
      owner: new Types.ObjectId(userId),
    }).exec();
    
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    
    return farm;
  }

  async update(userId: string, id: string, updateFarmDto: any): Promise<Farm> {
    const updatedFarm = await this.farmModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        owner: new Types.ObjectId(userId),
      },
      { $set: updateFarmDto },
      { new: true },
    ).exec();
    
    if (!updatedFarm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    
    return updatedFarm;
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const result = await this.farmModel.deleteOne({
      _id: new Types.ObjectId(id),
      owner: new Types.ObjectId(userId),
    }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    
    return true;
  }
}