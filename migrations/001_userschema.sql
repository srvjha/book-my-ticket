-- 001_userschema.sql

-- Write your migration below

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(312) NOT NULL UNIQUE,
    password VARCHAR(66),
    salt TEXT,
    refresh_token VARCHAR(4096),
    created_at TIMESTAMP DEFAULT NOW(), 
    updated_at TIMESTAMP DEFAULT NOW()
)


