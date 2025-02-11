import { Document } from 'mongoose';

export interface IAdmin extends Document {
  token: string;
  _id: string;
  name: string;
  emailId: string;
  password: string;
}
