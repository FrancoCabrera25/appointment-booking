import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as SchemaMongoose } from 'mongoose';
import { User } from '../../auth/entities/user.entity';
import { Turn } from 'src/turn/entities/turn.entity';

@Schema()
export class InspectionResult extends Document {
  @Prop()
  qualification: number;
  @Prop()
  details: [SchemaMongoose.Types.Mixed];
  @Prop({
    required: true,
    default: 'PENDING',
    enum: ['PENDING', 'INPROGRESS', 'DONE'],
  })
  status: string;
  @Prop({
    enum: ['RECHECK', 'SAFE'],
  })
  inspectionStatus: string;
  @Prop()
  observations: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Turn' })
  turnId: Turn;
}

export const InspectionResultSchema =
  SchemaFactory.createForClass(InspectionResult);
