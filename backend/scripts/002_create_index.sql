CREATE UNIQUE INDEX IF NOT EXISTS username_idx ON users (username);

CREATE UNIQUE INDEX IF NOT EXISTS forgot_password_token_idx ON forgot_password_tokens (token);

CREATE UNIQUE INDEX IF NOT EXISTS confirm_account_token_idx ON confirm_account_tokens (token);

CREATE UNIQUE INDEX IF NOT EXISTS short_url_idx ON links (shorturl);