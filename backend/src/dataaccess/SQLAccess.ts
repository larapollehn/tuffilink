import {v4 as uuidv4} from "uuid";
const Pool = require('pg').Pool;
import log from "../log/Logger";

class SQLAccess {
    private pool = new Pool({
        user: process.env.POSTGRES_USER || 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        database: process.env.POSTGRES_DB || 'tinylink',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        port: 5432
    });

    constructor() {
        log.debug("Using SQL's pool with following information:", this.pool.options.host, this.pool.options.database, this.pool.options.user);
    }

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

    registerUserResult(username, hashedPassword, email) {
        return this.pool.query({
            rowMode: 'array',
            name: 'register-user',
            text: 'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id;',
            values: [username, hashedPassword, email]
        });
    }

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

    confirmUser(confirm_token){
        return this.pool.query({
            rowMode: 'array',
            name: 'confirm-user-account',
            text: `UPDATE users SET valid = true WHERE id = (select users.id from users, confirm_account_tokens WHERE users.id = confirm_account_tokens.user_id AND confirm_account_tokens.token = $1) RETURNING id;`,
            values: [confirm_token]
        });
    }

    deleteConfirmToken(confirm_token) {
        return this.pool.query({
            rowMode: 'array',
            name: 'delete-confirm-token',
            text: `DELETE FROM confirm_account_tokens where token = $1;`,
            values: [confirm_token]
        });
    }

    deleteOldResetPasswordToken(email){
        return this.pool.query({
            rowMode: 'array',
            name: 'delete-old-reset-password-token',
            text: 'DELETE FROM forgot_password_tokens WHERE user_id = (SELECT users.id FROM users WHERE email = $1);',
            values: [email]
        })
    }

    deleteUsedResetPasswordToken(resetToken){
        return this.pool.query({
            rowMode: 'array',
            name: 'delete-used-reset-token',
            text: `DELETE FROM forgot_password_tokens where token = $1;`,
            value: [resetToken]
        })
    }

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

    saveUrl(shortUrl, originalUrl, username){
        return this.pool.query({
            rowMode: 'array',
            name: 'save-url',
            text: 'INSERT INTO links (shorturl, originalurl, user_id) VALUES ($1, $2, (SELECT id FROM users WHERE username = $3)) RETURNING id',
            values: [shortUrl, originalUrl, username]
        })
    }

    getOriginalUrl(shortUrl){
        return this.pool.query({
            rowMode: 'array',
            name: 'get-original-url',
            text: 'UPDATE links SET visit_count = visit_count+1 WHERE shorturl = $1 RETURNING originalurl',
            values: [shortUrl]
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

    urlCount(user_id){
        return this.pool.query({
            rowMode: 'array',
            name: 'get-users-url-count',
            text: 'SELECT COUNT(*) FROM links WHERE user_id = $1',
            values: [user_id]
        })
    }
}

const sqlAccess = new SQLAccess();
export default sqlAccess;