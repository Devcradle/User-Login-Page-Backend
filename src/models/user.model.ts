import { Schema, model } from "mongoose";
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema(
    {
        name: {
            type: String
        },
        department: {
            type: String,
        },
        designation: {
            type: String
        },
        image: {
            type: Object,
            default: null
        },
        userId: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default model<IUser>('User', userSchema);