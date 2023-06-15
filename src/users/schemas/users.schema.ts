import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDetails } from './user-details.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: false })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    default:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png',
  })
  profilePic: string;

  @Prop({ type: Types.ObjectId, ref: 'UserDetails' })
  detailsId: UserDetails;

  @Prop()
  online: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
