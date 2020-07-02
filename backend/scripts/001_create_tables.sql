CREATE TABLE IF NOT EXISTS users (
id PRIMARY KEY SERIAL,
username VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
valid BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS forgot_password_tokens (
id PRIMARY KEY SERIAL,
token VARCHAR(255) UNIQUE NOT NULL,
user_id BIGINT REFERENCES users(id)
)

CREATE TABLE IF NOT EXISTS confirm_account_tokens (
id PRIMARY KEY SERIAL,
token VARCHAR(255) UNIQUE NOT NULL,
user_id BIGINT REFERENCES users(id)
)

CREATE IF NOT EXISTS UNIQUE INDEX username_idx ON users (username);

CREATE IF NOT EXISTS UNIQUE INDEX forgot_password_token_idx ON forgot_password_tokens (token);

CREATE IF NOT EXISTS UNIQUE INDEX confirm_account_token_idx ON confirm_account_tokens (token);