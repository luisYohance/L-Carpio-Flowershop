import { db } from "./index";
import { 
  rows, 
  bouquets, 
  rowBouquets, 
  bouquetFlowers, 
  bouquetConsumables,
  flowers,
  consumables
} from "./schema";
import { sql } from "drizzle-orm";

export async function initializeDatabase() {
  try {
    console.log("Initializing database...");

    // Create all tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS dyiflowershop_rows (
        id SERIAL PRIMARY KEY,
        title VARCHAR(256) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS dyiflowershop_bouquets (
        id SERIAL PRIMARY KEY,
        label VARCHAR(256) NOT NULL,
        image VARCHAR(1024) NOT NULL,
        price REAL NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS dyiflowershop_row_bouquets (
        row_id INTEGER NOT NULL,
        bouquet_id INTEGER NOT NULL,
        PRIMARY KEY (row_id, bouquet_id)
      );

      CREATE TABLE IF NOT EXISTS dyiflowershop_bouquet_flowers (
        bouquet_id INTEGER NOT NULL,
        flower_name VARCHAR(256) NOT NULL,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (bouquet_id, flower_name)
      );

      CREATE TABLE IF NOT EXISTS dyiflowershop_bouquet_consumables (
        bouquet_id INTEGER NOT NULL,
        consumable_name VARCHAR(256) NOT NULL,
        PRIMARY KEY (bouquet_id, consumable_name)
      );

      CREATE TABLE IF NOT EXISTS flowers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        quantity INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS consumables (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
    `);

    // Insert initial consumables if they don't exist
    const initialConsumables = [
      "Wrapper",
      "Silk",
      "Ribbon",
      "Sequins",
      "Glitter"
    ];

    for (const name of initialConsumables) {
      await db.insert(consumables)
        .values({ name })
        .onConflictDoNothing();
    }

    console.log("Database initialization completed successfully");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
} 