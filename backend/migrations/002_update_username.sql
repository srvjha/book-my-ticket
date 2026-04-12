-- 002_update_username.sql

-- Write your migration below

ALTER TABLE users RENAME COLUMN user_name TO username;

