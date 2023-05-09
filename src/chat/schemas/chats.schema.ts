import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ required: true })
  members: string[];

  @Prop({ required: true })
  messages: {
    sender: string;
    content: string;
    createdAt: Date;
  }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
