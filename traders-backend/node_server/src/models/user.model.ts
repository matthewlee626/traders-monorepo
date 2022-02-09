import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  gameChoice: string;
  gameRoomId: string;
  isAdmin: boolean;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gameChoice: {
    type: String,
    enum: ['A', 'B', 'C'],
  },
  gameRoomId: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export default model<IUser>('user', userSchema);
