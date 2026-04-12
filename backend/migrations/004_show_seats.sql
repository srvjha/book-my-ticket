-- 004_show_seats.sql

-- Write your migration below


CREATE TABLE shows (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE show_seats (
    id SERIAL PRIMARY KEY,
    show_id INT,
    seat_id INT,

    price DECIMAL(10,2) CHECK (price >= 0),
    is_booked BOOLEAN DEFAULT FALSE,

    UNIQUE(show_id, seat_id),

    FOREIGN KEY (show_id) REFERENCES shows(id),
    FOREIGN KEY (seat_id) REFERENCES seats(id)
);