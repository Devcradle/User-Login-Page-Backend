import { createTransport } from 'nodemailer';

export async function sendResetPasswordEmail(emailId: string, token: String): Promise<any> {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILID,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        to: emailId,
        from: process.env.EMAILID,
        subject: "Password Reset",
        text: `Reset your password`,
        html: `<span>Hello, <br/>Click on the given link to reset your password</span><br/>
        <span>Link: <a href="http://localhost:${process.env.APP_PORT}/${process.env.API_VERSION}/resetpassword/${token}">Click here</a></span>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}