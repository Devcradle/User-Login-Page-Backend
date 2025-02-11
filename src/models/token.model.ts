import { model, Schema } from "mongoose";
import { IToken } from "../interfaces/token.interface";

const tokenSchema = new Schema(
    {
        accessToken: {
            type: String
        },
        refreshToken: {
            type: String
        },
        userId: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true
    }
);


export default model<IToken>('Token', tokenSchema);