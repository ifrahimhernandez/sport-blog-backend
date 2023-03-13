import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  roles: string[];
}

export interface IUserModel extends IUser, Document { }

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  },
  {
    versionKey: false
  }
);

export default mongoose.model<IUserModel>('User', UserSchema);
