import jwt from 'jsonwebtoken';
import Token from '../models/token.model';


class UserTokenUtil {
  
  public static async generateToken(
    body: Record<string, string>,
    secretKey: string,
    time: string
  ): Promise<string> {
    try{
      const token = jwt.sign(body, secretKey, { expiresIn: time });
      return token;
    }catch(error){
      throw new Error(error);
    }
  }

  public static async verifyToken(
    token: string,
    secretKey: string
  ): Promise<unknown> {
    try{
      const payload = jwt.verify(token, secretKey);
      return payload;
    }catch(error){
      throw new Error(error);
    }
  }

  public static async storeToken(
    accessToken: string,
    refreshToken: string,
    userId: string
  ): Promise<unknown> {
    try{
      const data = await Token.create({accessToken, refreshToken, userId});
      return data;
    }catch(error){
      throw new Error(error);
    }
  }

  public static async updateToken(
    accessToken: string,
    refreshToken: string,
    userId: string
  ): Promise<unknown> {
    try{
      const data = await Token.updateOne({userId}, { $set: {accessToken, refreshToken}});
      return data;
    }catch(error){
      throw new Error(error);
    }
  }

  public static async getToken(
    userId: string
  ): Promise<unknown> {
    try{
      const data = await Token.findOne({userId});
      return data;
    }catch(error){
      throw new Error(error);
    }
  }

  public static async removeToken(
    userId: string
  ): Promise<unknown> {
    try{
      const data = await Token.deleteOne({userId});
      return data;
    }catch(error){
      throw new Error(error);
    }
  }

}

export default UserTokenUtil;
