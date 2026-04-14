import { pool, query } from "../../db/index.js";
import ApiError from "../../utils/api-error.js";

class BookingService {
    async getAllSeats(showId) {
        const results = await query(
            `
            SELECT
                s.id,
                s.row_number,
                s.seat_number,
                s.seat_type,
                ss.price,
                ss.is_booked,
                (
                    SELECT u.username 
                    FROM bookings b 
                    JOIN users u ON u.id = b.user_id 
                    WHERE b.seat_id = s.id AND b.show_id = $1 
                    LIMIT 1
                ) as booked_by_username
            FROM seats s
            JOIN show_seats ss ON s.id = ss.seat_id
            WHERE ss.show_id = $1
            ORDER BY s.row_number, s.seat_number
            `,
            [showId]
        )
        return results.rows
    }

    async getAllShows() {
        const results = await query(
            `SELECT id, movie_name, start_time,banner_url FROM shows`
        );
        return results.rows;
    }

    async getShowById(id) {
        const results = await query(
            `SELECT id, movie_name, start_time,banner_url FROM shows WHERE id = $1`,
            [id]
        );
        return results.rows[0];
    }

    // async bookSeat(seatId, username) {
    //     try {
    //         const userDetails = await query(
    //             `SELECT id FROM users WHERE username = $1`,
    //             [username]
    //         )
    //         if (userDetails.rowCount === 0) {
    //             throw ApiError.badRequest("User not found");
    //         }
    //         const userId = userDetails.rows[0].id;
    //         const showResult = await query("SELECT id FROM shows LIMIT 1");
    //         if (showResult.rowCount === 0) {
    //             throw ApiError.badRequest("No shows available");
    //         }
    //         const showId = showResult.rows[0].id;
    //         const connection = await pool.connect();

    //         try {
    //             await connection.query("BEGIN");
                
    //             // Lock the row to prevent race conditions
    //             const sql = `
    //                 SELECT ss.*
    //                 FROM show_seats ss
    //                 WHERE ss.seat_id = $1 AND ss.show_id = $2 AND ss.is_booked = false 
    //                 FOR UPDATE;
    //             `;
    //             const result = await connection.query(sql, [seatId, showId]);
                
    //             if (result.rowCount === 0) {
    //                 await connection.query("ROLLBACK");
    //                 throw ApiError.badRequest("Seat already booked or not available for this show");
    //             }

    //             // Update seat status
    //             const updateSQL = `
    //                 UPDATE show_seats
    //                 SET is_booked = true
    //                 WHERE seat_id = $1 AND show_id = $2
    //             `;
    //             await connection.query(updateSQL, [seatId, showId]);

    //             // Insert into bookings table
    //             const insertSQL = `
    //                 INSERT INTO bookings (seat_id, show_id, user_id)
    //                 VALUES ($1, $2, $3)
    //                 RETURNING *
    //             `;
    //             const bookingResult = await connection.query(insertSQL, [seatId, showId, userId]);
                
    //             await connection.query("COMMIT");
    //             return bookingResult.rows[0];
    //         } catch (error) {
    //             await connection.query("ROLLBACK");
    //             throw error;
    //         } finally {
    //             connection.release();
    //         }
    //     } catch (error) {
    //         console.error("Booking Error:", error);
    //         if (error instanceof ApiError) throw error;
    //         throw ApiError.internalServerError(error.message || "Something went wrong during booking");
    //     }
    // }

    /*
    Here I have used multiple seatIds to book multiple seats at once to achieve atomicity.
    */

    async bookSeats(seatIds, username, showId) {
        try {
            const userResult = await query(`SELECT id FROM users WHERE username = $1`, [username]);
            if (userResult.rowCount === 0) throw ApiError.badRequest("User not found");
            const userId = userResult.rows[0].id;

            if (!showId) throw ApiError.badRequest("Show ID is required");

            const connection = await pool.connect();
            try {
                await connection.query("BEGIN");
                
                // 1. Verify availability and lock rows
                const checkSql = `
                    SELECT ss.seat_id
                    FROM show_seats ss
                    WHERE ss.seat_id = ANY($1) AND ss.show_id = $2 AND ss.is_booked = false 
                    FOR UPDATE;
                `;
                const checkResult = await connection.query(checkSql, [seatIds, showId]);
                
                if (checkResult.rowCount !== seatIds.length) {
                    await connection.query("ROLLBACK");
                    throw ApiError.badRequest("One or more seats are already booked or unavailable");
                }

                // 2. Mark as booked
                const updateSQL = `
                    UPDATE show_seats
                    SET is_booked = true
                    WHERE seat_id = ANY($1) AND show_id = $2
                `;
                await connection.query(updateSQL, [seatIds, showId]);

                // 3. Record the bookings
                const bookings = [];
                for (const seatId of seatIds) {
                    const insertSQL = `
                        INSERT INTO bookings (seat_id, show_id, user_id)
                        VALUES ($1, $2, $3)
                        RETURNING *
                    `;
                    const res = await connection.query(insertSQL, [seatId, showId, userId]);
                    bookings.push(res.rows[0]);
                }
                
                await connection.query("COMMIT");
                return bookings;
            } catch (error) {
                await connection.query("ROLLBACK");
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error("Bulk Booking Error:", error);
            if (error instanceof ApiError) throw error;
            throw ApiError.internalServerError("Error during bulk booking");
        }
    }
}

export default new BookingService()