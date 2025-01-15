import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  department: string;
  designation: string;
  image?: Record<string, unknown>;
}
