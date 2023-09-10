import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

@Schema()
export class Vehicle extends Document {
  @Prop({ required: true, maxlength: 6 })
  patent: string;

  @Prop({ required: false })
  brand: string;
  @Prop({ required: false })
  model: string;
  @Prop({ required: false })
  year: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

// Índice compuesto en userId y patent
VehicleSchema.index({ userId: 1, patent: 1 }, { unique: true });
