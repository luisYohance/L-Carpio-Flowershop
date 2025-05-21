import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { sql } from "drizzle-orm";

config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const sqlClient = neon(process.env.DATABASE_URL);
const db = drizzle(sqlClient);

async function migrate() {
  try {
    console.log("Creating orders table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS dyiflowershop_orders (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(256) NOT NULL,
        total_price REAL NOT NULL,
        items JSONB NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ
      );
    `);
    console.log("Orders table created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate(); 