import { sql } from "drizzle-orm";
import { db } from "../index";

export async function up() {
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
  } catch (error) {
    console.error("Error creating orders table:", error);
    throw error;
  }
}

export async function down() {
  try {
    console.log("Dropping orders table...");
    await db.execute(sql`DROP TABLE IF EXISTS dyiflowershop_orders;`);
    console.log("Orders table dropped successfully!");
  } catch (error) {
    console.error("Error dropping orders table:", error);
    throw error;
  }
} 