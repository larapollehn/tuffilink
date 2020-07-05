import sqlAccess from "../dataaccess/SQLAccess";
import log from "../log/Logger";
import {pbkdf} from "../algorithms/PBKDF2";
import {jwt} from "../algorithms/JWT";
import emailAccess from "../dataaccess/EmailAccess";


/**
 * https://app.swaggerhub.com/apis/larapollehn/tinylink/1.0.0#/user/post_user
 *
 * @param expressRequest
 * @param expressResponse
 */
const registerNewUser = async (expressRequest, expressResponse) => {
    const username: string = expressRequest.body['username'];
    const password: string = expressRequest.body['password'];
    const email: string = expressRequest.body['email'];

    log.debug('User wants to be registered with following dataaccess', username, password, email);

    if (username && typeof username === 'string' && password && typeof password === 'string' && email && typeof email === 'string') {
        const hashedPassword = pbkdf.hashPBKDF2(password);
        try {
            await sqlAccess.begin();
            const insertUserResult = await sqlAccess.registerUserResult(username, hashedPassword, email);
            const insertedUserId = insertUserResult.rows[0][0];
            log.debug("User was registered and created in db with following id: ", insertedUserId);
            try {
                const insertVerificationResult = await sqlAccess.insertVerificationResult(insertedUserId);
                const insertedToken = insertVerificationResult.rows[0][0];
                log.debug('Email verification token created for user', insertedToken);
                if (process.env.SEND_EMAIL === 'true') {
                    await emailAccess.sendConfirmAccountMail(email, insertedToken);
                }
                await sqlAccess.commit();
                expressResponse.status(201).send('User registered and created in db');
            } catch (e) {
                await sqlAccess.rollback();
                log.debug('Can not create email verification token. Sorry bro', e.stack);
                expressResponse.status(500).send(e.message);
            }
        } catch (e) {
            await sqlAccess.rollback();
            log.debug('An error happened while creating new user', e.stack);
            expressResponse.status(409).send(e.message);
        }
    } else {
        expressResponse.status(400).send('Username, password and or email are missing');
    }
};

/**
 * https://app.swaggerhub.com/apis/larapollehn/tinylink/1.0.0#/user/post_user_login
 *
 * @param expressRequest
 * @param expressResponse
 */
const loginUser = async (expressRequest, expressResponse) => {
    const username = expressRequest.body['username'];
    const password = expressRequest.body['password'];
    log.debug('user wants to login with following credentials:', username, password);
    if (username && typeof username === 'string' && password && typeof password === 'string') {
        try {

            // Query in database for eventual stored user dataaccess
            const QueryUserLoginResult = await sqlAccess.userLoginResult(username);
            log.debug('Retrieved user dataaccess:', QueryUserLoginResult.rows);

            const userArray = QueryUserLoginResult.rows;
            if (userArray.length !== 1) {
                expressResponse.status(404).send('User not found');
                return;
            }

            const userData = userArray[0];

            // Verify input password with stored hashed password
            const userPasswordHash = userData[2];
            if (!pbkdf.verify(password, userPasswordHash)) {
                expressResponse.status(401).send('Wrong password');
                return;
            }

            // Verify that user's email is verified
            if (process.env.SEND_EMAIL === 'true' && userData[4] === false) {
                expressResponse.status(403).send('Account not verified');
                return;
            }

            // Generate JWT token. We only need the user name of the user
            // Never include sensible information in the token
            const tokenPayload = {
                'id': userData[0],
                'username': username
            };
            let userJWTToken = jwt.generate(tokenPayload);
            expressResponse.status(200).send({'token': userJWTToken});
        } catch (e) {
            log.debug('Could not get requested user dataaccess', e);
            expressResponse.status(500).send(e.message);
        }
    } else {
        expressResponse.status(400).send('User data for login missing');
    }
};

/**
 * https://app.swaggerhub.com/apis/larapollehn/tinylink/1.0.0#/user/put_user_password
 *
 * @param expressRequest
 * @param expressResponse
 */
const changeUserPassword = async (expressRequest, expressResponse) => {
    const newPassword = expressRequest.body['new_password'];
    const newHashedPassword = pbkdf.hashPBKDF2(newPassword);
    const user = expressRequest.user['username'];
    if(newPassword && typeof newPassword === 'string' && user && typeof user === 'string'){
        try {
            await sqlAccess.changePassword(newHashedPassword, user).rows;
            log.debug('User password was changed');
            expressResponse.status(200).send('User password was changed');
        } catch (e) {
            expressResponse.status(500).send('User password change not successful', e.message);
        }
    } else {
        expressResponse.status(400).send('Data for password change missing');
    }
};

/**
 * https://app.swaggerhub.com/apis/larapollehn/tinylink/1.0.0#/user/put_user_forgot_password_reset
 *
 * @param expressRequest
 * @param expressResponse
 */
const resetForgottenPassword = async (expressRequest, expressResponse) => {
    const forgotPasswordToken = expressRequest.body['reset_password_token'];
    const newPassword = expressRequest.body['new_password'];
    const hashedNewPassword = pbkdf.hashPBKDF2(newPassword);
    if (forgotPasswordToken && typeof forgotPasswordToken === 'string' &&
        newPassword && typeof newPassword === 'string'){
        try{
            sqlAccess.begin();
            const resetPasswordResult = await sqlAccess.resetPassword(forgotPasswordToken, hashedNewPassword).rows;
            log.debug('User password change result:', resetPasswordResult);
            if (resetPasswordResult.length !== 1){
                sqlAccess.rollback();
                expressResponse.status(404).send('Given dataaccess not found');
                return;
            } else {
                log.debug('User password was changed for user with id:', resetPasswordResult[0][0]);
                await sqlAccess.deleteUsedResetPasswordToken(forgotPasswordToken);
                sqlAccess.commit();
                expressResponse.status(200).send('User password was changed');
            }
        } catch (e) {
            sqlAccess.rollback();
            expressResponse.status(404).send(e.message);
        }
    } else {
        expressResponse.status(400).send('Forgot password token or new password are missing');
    }
};

/**
 * https://app.swaggerhub.com/apis/larapollehn/tinylink/1.0.0#/user/post_user_forgot_password
 *
 * @param expressRequest
 * @param expressResponse
 */
const sendResetPasswordMail = async (expressRequest, expressResponse) => {
    const userEmail = expressRequest.body['email'];
    if (userEmail && typeof userEmail === 'string') {
        try{
            await sqlAccess.deleteOldResetPasswordToken(userEmail);
            const createResetTokenResult = await sqlAccess.createResetPasswordToken(userEmail);
            const queryResult = createResetTokenResult.rows;
            if(queryResult.length !== 1){
                expressResponse.status(404).send('User not found');
                return;
            } else {
                const resetPasswordToken = queryResult[0][0];
                log.debug('User reset token was created and will be send per email:', resetPasswordToken);
                if (process.env.SEND_EMAIL === 'true'){
                    await emailAccess.sendResetPasswordLink(userEmail, resetPasswordToken);
                }
                expressResponse.status(201).send('Reset password token was created');
            }
        } catch (e) {
            log.debug('Could not create reset password token', e);
            expressResponse.status(500).send(e.message);
        }
    } else {
        expressResponse.status(400).send('User email is missing');
    }
};

/**
 * https://app.swaggerhub.com/apis/larapollehn/tinylink/1.0.0#/user/post_user_confirm__confirm_token_
 * @param expressRequest
 * @param expressResponse
 */
const confirmUserAccount = async (expressRequest, expressResponse) => {
    const confirmToken = expressRequest.params.confirm_token;
    if (confirmToken && typeof confirmToken === 'string') {
        try {
            await sqlAccess.begin();
            const confirmResult = await sqlAccess.confirmUser(confirmToken);
            const confirmedUserId = confirmResult.rows;
            if (confirmedUserId.length !== 1) {
                await sqlAccess.rollback();
                expressResponse.status(404).send('User account was not found');
                return;
            } else {
                await sqlAccess.deleteConfirmToken(confirmToken);
                await sqlAccess.commit();
                log.debug('User account was confirmed', confirmToken);
                expressResponse.redirect(process.env.FRONTEND_LINK);
            }
        } catch (e) {
            await sqlAccess.rollback();
            log.debug('User account could not be confirmed', e.stack);
            expressResponse.status(404).send(e.message);
        }
    } else {
        expressResponse.status(400).send('User confirmToken is missing');
    }
};

export {
    registerNewUser,
    loginUser,
    changeUserPassword,
    resetForgottenPassword,
    sendResetPasswordMail,
    confirmUserAccount
}
