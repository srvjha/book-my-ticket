-- 007_add_movie_banner.sql

-- Write your migration below

ALTER TABLE shows
ADD COLUMN banner_url TEXT DEFAULT 'https://res.cloudinary.com/sauravjha/image/upload/v1776184197/placeholder_zeyvnq.png';



