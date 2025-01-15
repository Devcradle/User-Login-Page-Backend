import Admin from '../models/admin.model';
import { IAdmin } from '../interfaces/admin.interface';
import bcrypt from 'bcrypt';
import UserTokenUtil from '../utils/token.util';
import { sendResetPasswordEmail } from '../utils/mail.util';

class AdminService {
  public signUp = async (body: IAdmin): Promise<IAdmin> => {
    const data = await Admin.create(body);
    return data;
  };

  // eslint-disable-next-line max-len
  public login = async (
    emailId: string,
    password: string
  ): Promise<unknown> => {
    const user = await Admin.findOne({ emailId });
    if (user === null) {
      return user;
    } else {
      const name = user.name;
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = await UserTokenUtil.generateToken(
          { emailId: user.emailId, id: user._id },
          process.env.SECRET_KEY,
          '24h'
        );
        return { name, emailId, token };
      }
      return passwordMatch;
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
