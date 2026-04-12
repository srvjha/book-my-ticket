-- 006_booking_schema.sql

-- Write your migration below

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    seat_id INTEGER REFERENCES seats(id),
    show_id INTEGER REFERENCES shows(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


