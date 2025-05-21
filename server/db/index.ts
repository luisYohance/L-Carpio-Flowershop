import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { env } from "~/env";
import * as schema from "./schema";

config({ path: ".env" }); // or .env.local

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Test the connection
async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

testConnection();




