import fs from "fs";
import path from "path";
import pg from "pg";
import { env } from "./src/config/env.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    // 1. Create migrations table (if not exists)
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE,
        run_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. Get already applied migrations
    const res = await client.query("SELECT filename FROM migrations");
    const applied = new Set(res.rows.map(r => r.filename));

    // 3. Read migration files
    const migrationsDir = path.join(process.cwd(), "migrations");

    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith(".sql"))
      .sort(); // important: ensures order

    // 4. Run pending migrations
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping ${file}`);
        continue;
      }

      console.log(`Running ${file}`);

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          "INSERT INTO migrations (filename) VALUES ($1)",
          [file]
        );

        await client.query("COMMIT");

        console.log(`Done ${file}`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`Failed ${file}`);
        throw err;
      }
    }

    console.log("All migrations complete");

  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();