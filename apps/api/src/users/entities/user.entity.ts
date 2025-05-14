// apps/api/src/users/entities/user.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  }
})
export class User {
  // Add the id property to the TypeScript class definition
  id?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  otp: string;

  @Prop()
  otpExpiry: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual for id that returns the _id as string
UserSchema.virtual('id').get(function() {
  return this._id.toString();
});