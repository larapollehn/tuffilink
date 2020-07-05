const nodemailer = require("nodemailer");

const MAILPWD = process.env.MAILPWD;
const SENDER = process.env.SENDER;
const HOST = process.env.HOST;
const FRONTEND_LINK = process.env.FRONTEND_LINK;

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

    sendConfirmAccountMail(receiver, confirmToken){
        return this.transporter.sendMail({
            from: SENDER,
            to: receiver,
            subject: 'Confirm user account',
            text: `Please click on the following link to confirm your registered user account: https://tinylink.larapollehn.de/api/user/confirm/${confirmToken}`
        });
    }

    sendResetPasswordLink(receiver, token){
        return this.transporter.sendMail({
            from: SENDER,
            to: receiver,
            subject: 'Reset your password',
            text: `Please click on the following link to reset your password:  ${FRONTEND_LINK}/ui/forgotpassword/?token=${token}`
        });
    }
}

const emailService = new EmailAccess();
export default emailService;