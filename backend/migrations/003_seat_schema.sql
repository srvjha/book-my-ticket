-- 003_seat_schema.sql

-- Write your migration below

CREATE TABLE screens(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE seats(
    id SERIAL PRIMARY KEY,
    screen_id INT NOT NULL,
    row_number VARCHAR(5) NOT NULL,
    seat_number INT NOT NULL,
    seat_type VARCHAR(50) DEFAULT('REGULAR'),

    UNIQUE(screen_id,row_number,seat_number),
    FOREIGN KEY(screen_id) REFERENCES Screens(id)
)
