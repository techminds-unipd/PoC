import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  _id: string;

  @Prop()
  token: string;

  @Prop()
  expiry: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
