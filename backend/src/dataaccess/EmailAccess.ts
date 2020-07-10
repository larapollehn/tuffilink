const nodemailer = require("nodemailer");

const MAILPWD = process.env.MAILPWD;
const SENDER = process.env.SENDER;
const HOST = process.env.HOST;

/**
 * used to send user mail for account verifying and password reset
 */
class EmailAccess{
    private transporter = nodemailer.createTransport({
        host: HOST,
        port: 587,
        secure: false,
        auth: {
            user: SENDER,
            pass: MAILPWD,
        },
    });

    /**
     * send link with random token to user after registration for account verification
     * @param receiver mail of user
     * @param confirmToken is token used as param in url send to user
     */
    sendConfirmAccountMail(receiver, confirmToken){
        return this.transporter.sendMail({
            from: SENDER,
            to: receiver,
            subject: 'Confirm user account',
            text: `Please click on the following link to confirm your registered user account: https://tinylink.larapollehn.de/api/user/confirm/${confirmToken}`
        });
    }

    /**
     * send link ti user after he demands a password reset
     * @param receiver mail of user
     * @param token is token used as param in url send to user
     */
    sendResetPasswordLink(receiver, token){
        return this.transporter.sendMail({
            from: SENDER,
            to: receiver,
            subject: 'Reset your password',
            text: `Please click on the following link to reset your password:  https://tinylink.larapollehn.de/ui/forgotpassword?token=${token}`
        });
    }
}

const emailService = new EmailAccess();
export default emailService;
