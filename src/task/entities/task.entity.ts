import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    required: true,
    enum: ['New', 'In progress', 'Done'],
    default: 'New',
  })
  status: string;

  @Prop({ required: true })
  projectId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
