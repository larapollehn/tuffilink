import sqlAccess from "../data/SQLAccess";
import log from "../log/Logger";
import PBKDF2 from "../algorithms/PBKDF2";
import { v4 as uuidv4 } from 'uuid';
import {notify} from "./EmailService";

const pbkdf: PBKDF2 = new PBKDF2(20);

const registerNewUser = async (expressRequest, expressResponse) => {
    const username: string = expressRequest.body['username'];
    const password: string = expressRequest.body['password'];
    const hashedPassword = pbkdf.hashPBKDF2(password);
    const email: string = expressRequest.body['email'];

    log.debug('User wants to be registered with following data', username, password, email);

    if (username && typeof username === 'string' && password && typeof password === 'string' && email && typeof email === 'string') {
        try {
            await sqlAccess.query('BEGIN');
            const insertUserResult = await sqlAccess.query({
                rowMode: 'array',
                name: 'register-user',
                text: 'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id;',
                values: [username, hashedPassword, email]
            });
            const insertedUserId = insertUserResult.rows[0][0];
            log.debug("User was registered and created in db with following id: ", insertedUserId);
            try{
                const insertVerificationResult = await sqlAccess.query({
                    rowMode: 'array',
                    name: 'create-verification-token',
                    text: 'insert into confirm_account_tokens (token ,user_id) values ($1, $2) return token',
                    values: [uuidv4(), insertedUserId]
                });
                const insertedToken = insertVerificationResult.rows[0][0];
                log.debug('Email verification token created for user', insertedToken);
                if (process.env.SEND_EMAIL_VERIFICATION === 'true'){
                    await notify(email, "Please very your email to use tinyurl", insertedToken);
                }
                await sqlAccess.query('COMMIT');
                expressResponse.status(201).send('User registered and created in db');
            }catch (e) {
                await sqlAccess.query('ROLLBACK');
                log.debug('Can not create email verification token. Sorry bro', e.stack);
                expressResponse.status(500).send("An error happened. Try again");
            }
        }catch (e) {
            await sqlAccess.query('ROLLBACK');
            log.debug('An error happened while creating new user', e.stack);
            expressResponse.status(409).send(e.stack);
        }
    } else {
        expressResponse.status(400).send('Username, password and or email are missing');
    }
};

const loginUser = (expressRequest, expressResponse) => {

};

const changeUserPassword = (expressRequest, expressResponse) => {

};

const resetForgottenPassword = (expressRequest, expressResponse) => {

};

const sendResetPasswordMail = (expressRequest, expressResponse) => {

};

const confirmUserAccount = (expressRequest, expressResponse) => {

};

export {
    registerNewUser,
    loginUser,
    changeUserPassword,
    resetForgottenPassword,
    sendResetPasswordMail,
    confirmUserAccount
}
