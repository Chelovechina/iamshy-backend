import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Post } from 'src/posts/schemas/posts.schema';
import { UserDetails } from './user-details.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: false })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  gender: string;

  @Prop({ type: Types.ObjectId, ref: 'UserDetails' })
  detailsId: UserDetails;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'UserDetails' }] })
  posts: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);
