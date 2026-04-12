import { env } from "../config/env.js";
import pg from "pg";

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export { query,pool };
