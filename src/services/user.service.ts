import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

class UserService {
  public newUser = async (body: IUser): Promise<IUser> => {
    const data = await User.create(body);
    return data;
  };

  public editUser = async (
    body: Record<string, unknown>,
    id: string
  ): Promise<IUser> => {
    const data = await User.findByIdAndUpdate(id, body, { new: true });
    return data;
  };

  public getUsers = async (id: string): Promise<IUser[]> => {
    const data = await User.find({ userId: id });
    return data;
  };

  public getUser = async (id: string): Promise<IUser> => {
    const data = await User.findById(id);
    return data;
  };
}

export default UserService;
