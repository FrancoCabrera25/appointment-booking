import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';

@Schema()
export class Turn extends Document {
  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ required: true })
  hour: string;

  @Prop({
    required: true,
    default: 'PENDING',
    enum: ['PENDING', 'CANCELED', 'CONFIRM', 'RESERVED', 'FINISHED'],
  })
  status: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' })
  vehicleId: Vehicle;
}

export const Turnschema = SchemaFactory.createForClass(Turn);

// Define un índice único compuesto en fecha, vehiculo y usuario con estado "pendiente"
// Turnschema.index(
//   { date: 1, vehicleId: 1, userId: 1 },
//   { unique: true, partialFilterExpression: { status: 'pendiente' } },
// );
