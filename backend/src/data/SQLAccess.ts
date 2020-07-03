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
            text: 'insert into confirm_account_tokens (token ,user_id) values ($1, $2) return token',
            values: [uuidv4(), insertedUserId]
        });
    }

    userLoginResult(username) {
        return this.pool.query({
            rowMode: 'array',
            name: 'retrieve-user-data',
            text: 'SELECT * FROM users WHERE username = $1',
            values: [username]
        });
    }

    confirmUser(confirm_token){
        return this.pool.query({
            rowMode: 'array',
            name: 'confirm-user-account',
            text: 'UPDATE users SET valid = true WHERE users.id = confirm_account_tokens.user_id AND confirm_account_tokens.token = $1',
            values: [confirm_token]
        });
    }
}

const sqlAccess = new SQLAccess();
export default sqlAccess;