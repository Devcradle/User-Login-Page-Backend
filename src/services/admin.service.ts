import Admin from '../models/admin.model';
import { IAdmin } from '../interfaces/admin.interface';
import bcrypt from 'bcrypt';
import UserTokenUtil from '../utils/token.util';
import { sendResetPasswordEmail } from '../utils/mail.util';
import Token from '../models/token.model';
import { referrerPolicy } from 'helmet';

class AdminService {


  public signUp = async (body: IAdmin): Promise<IAdmin> => {
    const data = await Admin.create(body);
    return data;
  };


  // eslint-disable-next-line max-len
  public login = async (
    emailId: string,
    password: string
  ): Promise<any> => {
    const user = await Admin.findOne({ emailId });
    const { _id, name} = user;
    if (user === null) {
      return user;
    } else {
      const name = user.name;
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const refreshToken = await UserTokenUtil.generateToken(
          { emailId: user.emailId, id: _id },
          process.env.SECRET_KEY,
          '24h'
        );
        const accessToken = await UserTokenUtil.generateToken({
          emailId: user.emailId, id: _id}, process.env.SECRET_KEY_2, '15min'
        );
        const data = await UserTokenUtil.getToken(_id);
        data ?
         await UserTokenUtil.updateToken(accessToken, refreshToken, _id):
         await UserTokenUtil.storeToken(accessToken, refreshToken, _id)
        return { name, emailId, accessToken, refreshToken};
      }
      return passwordMatch;
    }
  };


  public glogin = async (
    emailId: string
  ): Promise<any> => {
    const user = await Admin.findOne({ emailId });
    if(user?.emailId === emailId){
      const {name} = user;
      const refreshToken = await UserTokenUtil.generateToken(
        { emailId: user.emailId, id: user._id },
        process.env.SECRET_KEY,
        '24h'
      );
      const accessToken = await UserTokenUtil.generateToken({
        emailId: user.emailId, id: user._id}, process.env.SECRET_KEY_2, '15min'
      )
      const data = await UserTokenUtil.getToken(user._id);
      data ?
       await UserTokenUtil.updateToken(accessToken, refreshToken, user._id):
       await UserTokenUtil.storeToken(accessToken, refreshToken, user._id)
      return {name, emailId, accessToken, refreshToken};
    }else{
      return false;
    }
  };



  public tokenCheck = async (
    accessToken: string,
    refreshToken: string
  ): Promise<any> => {
    try {
      const accessData = await UserTokenUtil.verifyToken(accessToken, process.env.SECRET_KEY_2);
      try{
        const refreshData = await UserTokenUtil.verifyToken(refreshToken, process.env.SECRET_KEY);
        return accessToken; 
      }catch(refreshError){
        const { emailId, id} = accessData as { emailId: string, id: string};
        const newRefreshToken = await UserTokenUtil.generateToken({emailId, id}, process.env.SECRET_KEY, '24h');
        await UserTokenUtil.updateToken(newRefreshToken, accessToken, id);
      }
    } catch (accessError) {
      try {
        const refreshData = await UserTokenUtil.verifyToken(refreshToken, process.env.SECRET_KEY);
        const { emailId, id } = refreshData as { emailId: string; id: string };

        const newAccessToken = await UserTokenUtil.generateToken(
          { emailId: emailId, id: id },
          process.env.SECRET_KEY_2,
          '15min'
        );

        await UserTokenUtil.updateToken(newAccessToken, refreshToken, id); 

        return newAccessToken;
      } catch (refreshError) {
        throw new Error('Access token and refresh token are invalid.');
      }
    }
  };


  public forgetpassword = async (emailId: string): Promise<string> => {
    const user = await Admin.findOne({ emailId });
    if (user) {
      const resetToken = await UserTokenUtil.generateToken(
        { emailId },
        process.env.SECRET_KEY_1,
        '15min'
      );
      await sendResetPasswordEmail(emailId, resetToken);
      await user.save();
      return resetToken as string;
    }
    return null;
  };



  public resetpassword = async (
    token: string,
    password: string
  ): Promise<boolean> => {
    const details = (await UserTokenUtil.verifyToken(
      token,
      process.env.SECRET_KEY_1
    )) as { emailId: string };

    const user = await Admin.findOne({ emailId: details.emailId });
    if (user) {
      const hashpassword = await bcrypt.hash(password, 10);
      user.password = hashpassword;
      await user.save();
      return true;
    }
    return false;
  };



  public getadmin = async (_id: string): Promise<Record<string, string>> => {
    const data = await Admin.findOne({ _id });
    const { name, emailId } = data;
    return { name, emailId };
  };



  public editadmin = async (
    body: Record<string, string>,
    _id: string
  ): Promise<Record<string, unknown>> => {
    const data = await Admin.findByIdAndUpdate(_id, body, { new: true });
    const { name, emailId } = data;
    return { name, emailId };
  };
}

export default AdminService;
