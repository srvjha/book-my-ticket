-- 005_update_show_schema.sql

ALTER TABLE shows
ADD screen_id INT NOT NULL,
ADD start_time TIMESTAMP NOT NULL,
ADD created_at TIMESTAMP DEFAULT NOW(),
ADD updated_at TIMESTAMP DEFAULT NOW(),

ADD CONSTRAINT fk_screen
FOREIGN KEY (screen_id) REFERENCES screens(id);

ALTER TABLE shows
RENAME COLUMN name TO movie_name;