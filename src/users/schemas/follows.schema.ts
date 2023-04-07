import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './users.schema';

export type FollowDocument = HydratedDocument<Comment>;

@Schema()
export class Follow {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  followerId: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  followedId: User;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
