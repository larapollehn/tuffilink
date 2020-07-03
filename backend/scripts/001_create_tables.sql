CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
username VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
valid BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS forgot_password_tokens (
id SERIAL PRIMARY KEY,
token VARCHAR(255) UNIQUE NOT NULL,
user_id BIGINT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS confirm_account_tokens (
id SERIAL PRIMARY KEY,
token VARCHAR(255) UNIQUE NOT NULL,
user_id BIGINT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS links (
id SERIAL PRIMARY KEY,
shorturl VARCHAR(10) UNIQUE NOT NULL,
originalurl TEXT NOT NULL,
visit_count BIGINT DEFAULT 0 NOT NULL,
user_id BIGINT REFERENCES users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS username_idx ON users (username);

CREATE UNIQUE INDEX IF NOT EXISTS forgot_password_token_idx ON forgot_password_tokens (token);

CREATE UNIQUE INDEX IF NOT EXISTS confirm_account_token_idx ON confirm_account_tokens (token);

CREATE UNIQUE INDEX IF NOT EXISTS short_url_idx ON links (shorturl);