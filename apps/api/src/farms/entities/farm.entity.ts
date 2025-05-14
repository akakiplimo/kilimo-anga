// apps/api/src/farms/entities/farm.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type FarmDocument = Farm & Document;

@Schema({ _id: false })
class Coordinate {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

const CoordinateSchema = SchemaFactory.createForClass(Coordinate);

@Schema({ timestamps: true })
export class Farm {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cropName: string;

  @Prop({ required: true })
  variety: string;

  @Prop({ required: true })
  acreage: number;

  @Prop({ required: true })
  sowingDate: Date;

  @Prop({ required: true, enum: ['Irrigated', 'Rainfed'] })
  watering: string;

  @Prop({ type: [CoordinateSchema], required: true })
  coordinates: Coordinate[];

  @Prop()
  soilType: string;

  @Prop()
  location: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;
}

export const FarmSchema = SchemaFactory.createForClass(Farm);