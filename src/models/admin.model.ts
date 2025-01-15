import { Schema, model } from 'mongoose';
import { IAdmin } from '../interfaces/admin.interface';

const adminSchema = new Schema(
  {
    name: {
      type: String
    },
    emailId: {
      type: String,
      unique: true
    },
    password: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default model<IAdmin>('Admin', adminSchema);
