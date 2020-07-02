const nodemailer = require("nodemailer");

const EMAILPW = process.env.MAILPWD;
const SENDER = process.env.SENDER;
const HOST = process.env.HOST;

let transporter = nodemailer.createTransport({
    host: HOST,
    port: 587,
    secure: false,
    auth: {
        user: SENDER,
        pass: EMAILPW,
    },
});

export function notify(receiver, title, message) {
    return transporter.sendMail({
        from: SENDER,
        to: receiver,
        subject: title,
        text: message
    });

}