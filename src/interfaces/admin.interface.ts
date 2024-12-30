import { Document } from 'mongoose';

export interface IAdmin extends Document {
  _id: string | number;
  name: string;
  emailId: string;
  password: string;
}
