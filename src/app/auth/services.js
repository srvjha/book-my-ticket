import { query } from "../../db/index.js";
import {
  generateAccessAndRefreshToken,
  hashPassword,
} from "./utils/index.js";
import ApiError from "../../utils/api-error.js";
import { env } from "../../config/env.js";
import JWT from "jsonwebtoken";
import { userSanitize } from "./utils/sanitize.js";

class AuthenticationService {
  async signUp(username,firstName,lastName, email, password) {
    // Check if user already exists
    const { rows: existing } = await query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email],
    );

    if (existing.length > 0) {
      throw ApiError.badRequest("User already exists");
    }

    const { salt, hashedPassword } = hashPassword(password, "");

    const { rows } = await query(
      `INSERT INTO users
        (username,first_name, last_name, email, password, salt)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [username,firstName, lastName, email, hashedPassword, salt],
    );

    const result = rows[0];
    return { id: result.id };
  }

  async signIn(email, password) {
    const { rows } = await query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email],
    );

    const existingUser = rows[0];

    if (!existingUser) {
      throw ApiError.notFound(`User with this email ${email} not found`);
    }

    const { hashedPassword } = hashPassword(password, existingUser.salt);

    if (hashedPassword !== existingUser.password) {
      throw ApiError.badRequest("email or password is incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existingUser.id,
    );

    return { accessToken, refreshToken };
  }

  async getUser(id) {
    const { rows } = await query(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [id],
    );

    const user = rows[0];

    if (!user) {
      throw ApiError.unauthorized("Invalid or expired token");
    }

    return userSanitize(user);
  }

  async signOut(id) {
    await query(
      "UPDATE users SET refresh_token = NULL WHERE id = $1",
      [id],
    );
  }

  async refreshTokens(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw ApiError.unauthorized("Invalid or Expired Token");
    }

    let decoded;
    try {
      decoded = JWT.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw ApiError.badRequest("Invalid or expired refresh token");
    }

    const { id } = decoded;
    const { rows } = await query(
      "SELECT * FROM users WHERE id = $1 AND refresh_token = $2 LIMIT 1",
      [id, incomingRefreshToken],
    );

    if (rows.length === 0) {
      // Refresh Token Reuse Detection
      // If a validly signed token is passed but it doesn't match the DB, it might be stolen.
      // Log the user out of all sessions immediately.
      await query("UPDATE users SET refresh_token = NULL WHERE id = $1", [id]);
      throw ApiError.unauthorized(
        "Refresh token revoked or invalid. Logging out for security.",
      );
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(id);

    return { accessToken, refreshToken };
  }
}

export default new AuthenticationService();
