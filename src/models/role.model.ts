import mongoose, { Document, Schema } from 'mongoose';

export interface IRole {
  name: string;
}

export interface IRoleModel extends IRole, Document { }

const AuthorSchema: Schema = new Schema(
  {
    name: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

export default mongoose.model<IRoleModel>('Role', AuthorSchema);
