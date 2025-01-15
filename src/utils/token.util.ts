import jwt from 'jsonwebtoken';

class UserTokenUtil {
  public static async generateToken(
    body: Record<string, string>,
    secretKey: string,
    time: string
  ): Promise<string> {
    const token = jwt.sign(body, secretKey, { expiresIn: time });
    return token;
  }

  public static async verifyToken(
    token: string,
    secretKey: string
  ): Promise<unknown> {
    const payload = jwt.verify(token, secretKey);
    return payload;
  }
}

export default UserTokenUtil;
