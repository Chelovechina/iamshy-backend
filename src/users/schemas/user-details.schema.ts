import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Post } from 'src/posts/schemas/posts.schema';
import { User } from './users.schema';

export type UserDetailsDocument = HydratedDocument<UserDetails>;

@Schema({ timestamps: false })
export class UserDetails {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
  posts: Post[];

  @Prop()
  gender: string;

  @Prop()
  instagram: string;

  @Prop()
  twitter: string;

  @Prop()
  linkein: string;

  @Prop()
  country: string;

  @Prop()
  website: string;
}

export const UserDetailsSchema = SchemaFactory.createForClass(UserDetails);
