import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CreateUserSessionDto } from '../../auth/dto/user-session.dto';

export type UserSessionDocument = UserSession & Document;
export interface IUserSessionModel extends Model<UserSessionDocument> {
  build(attrs: CreateUserSessionDto): UserSessionDocument;
}
@Schema({
  timestamps: true,
  // timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class UserSession {
  @Prop({ type: Date, expires: '10080m', default: Date.now })
  createdAt!: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  userId!: string;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
