import jwt from 'jsonwebtoken';

class UserTokenUtil {
    public static async generateToken(body: object, secretKey: string, time: string): Promise<String>{
        const token = jwt.sign(body, secretKey, {expiresIn: time});
        return token;
    };

    public static async verifyToken(token: string, secretKey: string): Promise<Object>{
        const payload = jwt.verify(token, secretKey);
        return payload;
    }
}

export default UserTokenUtil;