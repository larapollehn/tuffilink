ALTER TABLE forgot_password_tokens
DROP CONSTRAINT forgot_password_tokens_user_id_fkey,
ADD CONSTRAINT forgot_password_tokens_user_id_fkey
   FOREIGN KEY (user_id)
   REFERENCES users(id)
   ON DELETE CASCADE;

ALTER TABLE confirm_account_tokens
DROP CONSTRAINT confirm_account_tokens_user_id_fkey,
ADD CONSTRAINT confirm_account_tokens_user_id_fkey
   FOREIGN KEY (user_id)
   REFERENCES users(id)
   ON DELETE CASCADE;

ALTER TABLE links
DROP CONSTRAINT links_user_id_fkey,
ADD CONSTRAINT links_user_id_fkey
   FOREIGN KEY (user_id)
   REFERENCES users(id)
   ON DELETE CASCADE;

ALTER TABLE clicks
DROP CONSTRAINT clicks_link_id_fkey,
ADD CONSTRAINT clicks_link_id_fkey
   FOREIGN KEY (link_id)
   REFERENCES links(id)
   ON DELETE CASCADE;