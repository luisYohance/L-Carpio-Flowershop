import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';
import { env } from '~/env';
import { db } from "./index";
import { orders } from "./schema";

const setupDatabase = async () => {
  const sql = postgres(env.DATABASE_URL);
  
  try {
    console.log('Starting database setup...');
    
    // Read the SQL file
    const sqlFile = readFileSync(join(process.cwd(), 'src/server/db/schema.sql'), 'utf8');
    
    // Split the SQL file into individual statements
    const statements = sqlFile
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement separately
    for (const statement of statements) {
      try {
        await sql.unsafe(statement);
        console.log('Executed:', statement.split('\n')[0] + '...');
      } catch (error) {
        // If the error is about table already existing, we can ignore it
        if (error instanceof Error && error.message.includes('already exists')) {
          console.log('Table already exists, skipping...');
          continue;
        }
        throw error;
      }
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await sql.end();
  }
};

async function main() {
  try {
    console.log("Creating orders table...");
    await db.execute(`
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
    process.exit(1);
  }
}

setupDatabase().catch((err) => {
  console.error('Setup failed!');
  console.error(err);
  process.exit(1);
});

main(); 