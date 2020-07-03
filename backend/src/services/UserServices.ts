import sqlAccess from "../data/SQLAccess";
import log from "../log/Logger";
import PBKDF2 from "../algorithms/PBKDF2";
import JWT from "../algorithms/JWT";
import {v4 as uuidv4} from 'uuid';
import {notify} from "./EmailService";

const JWT_SECRET = process.env.JWT_SECRET;
const TTL = 1000 * 60 * 60 * 24 * 7;

const pbkdf: PBKDF2 = new PBKDF2(20);
const jwt: JWT = new JWT(JWT_SECRET, TTL);

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
            try {
                const insertVerificationResult = await sqlAccess.query({
                    rowMode: 'array',
                    name: 'create-verification-token',
                    text: 'insert into confirm_account_tokens (token ,user_id) values ($1, $2) return token',
                    values: [uuidv4(), insertedUserId]
                });
                const insertedToken = insertVerificationResult.rows[0][0];
                log.debug('Email verification token created for user', insertedToken);
                if (process.env.SEND_EMAIL_VERIFICATION === 'true') {
                    await notify(email, "Please very your email to use tinyurl", insertedToken);
                }
                await sqlAccess.query('COMMIT');
                expressResponse.status(201).send('User registered and created in db');
            } catch (e) {
                await sqlAccess.query('ROLLBACK');
                log.debug('Can not create email verification token. Sorry bro', e.stack);
                expressResponse.status(500).send("An error happened. Try again");
            }
        } catch (e) {
            await sqlAccess.query('ROLLBACK');
            log.debug('An error happened while creating new user', e.stack);
            expressResponse.status(409).send(e.stack);
        }
    } else {
        expressResponse.status(400).send('Username, password and or email are missing');
    }
};

const loginUser = async (expressRequest, expressResponse) => {
    const username = expressRequest.body['username'];
    const password = expressRequest.body['password'];
    log.debug('user wants to login with following credentials:', username, password);

    if (username && typeof username === 'string' && password && typeof password === 'string') {
        try {

            // Query in database for eventual stored user data
            const QueryUserLoginResult = await sqlAccess.query({
                rowMode: 'array',
                name: 'retrieveUserData',
                text: 'SELECT * FROM users WHERE username = $1',
                values: [username]
            });
            log.debug('Retrieved user data:', QueryUserLoginResult.rows);

            const userArray = QueryUserLoginResult.rows;
            if (userArray.length !== 1){
                expressResponse.status(404).send('User not found');
            }

            const userData = userArray[0];

            // Verify input passwith with stored hashed password
            const userPasswordHash = userData[2];
            if (!pbkdf.verify(password, userPasswordHash)){
                expressResponse.status(401).send('Wrong password');
            }

            // Verify that user's email is verified
            if (process.env.SEND_EMAIL_VERIFICATION === 'true' && userData[4] === false){
                expressResponse.status(403).send('Account not verified');
            }

            // Generate JWT token. We only need the user name of the user
            // Never include sensible information in the token
            const tokenPayload = {
                'username': username
            };
            let userJWTToken = jwt.generate(tokenPayload);
            expressResponse.status(200).send({'token': userJWTToken});
        } catch (e){
            log.debug('Could not get requested user data', e);
            expressResponse.status(500).send(e);
        }
    }
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
