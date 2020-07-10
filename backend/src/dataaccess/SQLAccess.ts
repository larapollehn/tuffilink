import {v4 as uuidv4} from "uuid";
const Pool = require('pg').Pool;
import log from "../log/Logger";

/**
 * manages access to postgres database
 */
class SQLAccess {
    private pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432
    });

    constructor() {
        log.debug("Using SQL's pool with following information:", this.pool.options.host, this.pool.options.database, this.pool.options.user);
    }

    // initialize db by running scripts for table, index creation
    initialize(data){
        this.pool.query(data);
    }

    begin() {
        return this.pool.query('BEGIN');
    }

    commit() {
        return this.pool.query('COMMIT');
    }

    rollback() {
        return this.pool.query('ROLLBACK');
    }

    /**
     * after user registration user data is persisted and user id is given as response
     * @param username of user
     * @param hashedPassword of user
     * @param email of user
     */
    registerUserResult(username, hashedPassword, email) {
        return this.pool.query({
            rowMode: 'array',
            name: 'register-user',
            text: 'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id;',
            values: [username, hashedPassword, email]
        });
    }

    /**
     * token generated for newly registered user is persisted
     * @param insertedUserId
     */
    insertVerificationResult(insertedUserId) {
        return this.pool.query({
            rowMode: 'array',
            name: 'create-verification-token',
            text: 'INSERT INTO confirm_account_tokens (token ,user_id) VALUES ($1, $2) RETURNING token',
            values: [uuidv4(), insertedUserId]
        });
    }

    userLoginResult(username) {
        return this.pool.query({
            rowMode: 'array',
            name: 'retrieve-user-dataaccess',
            text: 'SELECT * FROM users WHERE username = $1',
            values: [username]
        });
    }

    /**
     * if confirm-token exists the user account is confirmed and the user can login
     * @param confirm_token
     */
    confirmUser(confirm_token){
        return this.pool.query({
            rowMode: 'array',
            name: 'confirm-user-account',
            text: `UPDATE users SET valid = true WHERE id = (select users.id from users, confirm_account_tokens WHERE users.id = confirm_account_tokens.user_id AND confirm_account_tokens.token = $1) RETURNING id;`,
            values: [confirm_token]
        });
    }

    /**
     * after user confirmed account by clicking the provided link in the email the confirm-token is deleted
     * @param confirm_token
     */
    deleteConfirmToken(confirm_token) {
        return this.pool.query({
            rowMode: 'array',
            name: 'delete-confirm-token',
            text: `DELETE FROM confirm_account_tokens where token = $1;`,
            values: [confirm_token]
        });
    }

    /**
     * token send to user to let him reset password is deleted
     * if a new request to reset the password is made without clicking the previously send link
     * @param email
     */
    deleteOldResetPasswordToken(email){
        return this.pool.query({
            rowMode: 'array',
            name: 'delete-old-reset-password-token',
            text: 'DELETE FROM forgot_password_tokens WHERE user_id = (SELECT users.id FROM users WHERE email = $1);',
            values: [email]
        })
    }

    /**
     * if user reset password after clicking the link in his email,
     * the send token is delted
     * @param resetToken
     */
    deleteUsedResetPasswordToken(resetToken){
        log.debug("Deleting used reset password token for token", resetToken)
        return this.pool.query({
            rowMode: 'array',
            name: 'delete-used-reset-token',
            text: `DELETE FROM forgot_password_tokens where token = $1`,
            values: [resetToken]
        })
    }

    /**
     * token will be send to user as param of link to let him reset the password
     * @param email
     */
    createResetPasswordToken(email){
        return this.pool.query({
            rowMode: 'array',
            name: 'create-reset-password-token',
            text: 'insert into forgot_password_tokens (token ,user_id) values ($1, (select id from users where email = $2)) RETURNING token;',
            values: [uuidv4(), email]
        })
    }

    resetPassword(resetToken, hashedPassword){
        return this.pool.query({
            rowMode: 'array',
            name: 'reset-password',
            text: 'UPDATE users SET password_hash = $1 WHERE id = (SELECT user_id FROM forgot_password_tokens WHERE token = $2) RETURNING id',
            values: [hashedPassword, resetToken]
        })
    }

    changePassword(newHashedPassword, username){
        return this.pool.query({
            rowMode: 'array',
            name: 'change-password',
            text: 'UPDATE users SET password_hash = $1 WHERE username = $2 RETURNING id',
            values: [newHashedPassword, username]
        })
    }

    /**
     * if user shortens an url, the original and shortened form is persitet in the db
     */
    saveUrl(shortUrl, originalUrl, username){
        return this.pool.query({
            rowMode: 'array',
            name: 'save-url',
            text: 'INSERT INTO links (shorturl, originalurl, user_id) VALUES ($1, $2, (SELECT id FROM users WHERE username = $3)) RETURNING id',
            values: [shortUrl, originalUrl, username]
        })
    }

    /**
     * if a shortened link is used, the original url belonging to this shortened url is fetched from db
     * the click count used for statistics is incremented
     * the original url is returned needed for redirecting in the frontend
     */
    getOriginalUrl(shortUrl){
        return this.pool.query({
            rowMode: 'array',
            name: 'get-original-url',
            text: 'UPDATE links SET visit_count = visit_count+1 WHERE shorturl = $1 RETURNING originalurl',
            values: [shortUrl]
        });
    }

    /**
     * documents every click made for a url
     * @param shortUrl
     */
    createClick(shortUrl){
        return this.pool.query({
            rowMode: 'array',
            name: 'create-click',
            text: 'INSERT INTO clicks(link_id) values((SELECT id from links where shorturl = $1));',
            values: [shortUrl]
        });
    }

    getDailyClickCount(link_id, days) {
        return this.pool.query({
            rowMode: 'array',
            name: 'get-daily-click-count',
            text: `SELECT date_trunc('day', clicked_at) "day", count(clicked_at) 
            FROM clicks 
            WHERE link_id = $1 AND clicked_at >= to_timestamp(CAST($2 as bigint)/1000)::date
            group by 1 order by 1;`,
            values: [link_id, Date.now() - days * 1000 * 60 * 60 * 24]
        });
    }

    getUsersUrls(user_id, page_number, page_size){
        return this.pool.query({
            rowMode: 'array',
            name: 'get-users-urls',
            text: 'SELECT * FROM links WHERE user_id = $1 ORDER BY id DESC OFFSET $2  LIMIT $3',
            values: [user_id, page_number * page_size, page_size]
        })
    }

    /**
     * overall count of users shortened urls
     * @param user_id
     */
    urlCount(user_id){
        return this.pool.query({
            rowMode: 'array',
            name: 'get-users-url-count',
            text: 'SELECT COUNT(*) FROM links WHERE user_id = $1',
            values: [user_id]
        })
    }

    deleteUrl(userid, url_id){
        return this.pool.query({
            rowMode: 'array',
            name: 'delete-url',
            text: 'DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING id',
            values: [url_id, userid]
        })
    }

    getLink(user_id, url_id){
        return this.pool.query({
            rowMode: 'array',
            name: 'get-link',
            text: 'SELECT * FROM links WHERE id = $1 AND user_id = $2',
            values: [url_id, user_id]
        })
    }
}

const sqlAccess = new SQLAccess();
export default sqlAccess;
