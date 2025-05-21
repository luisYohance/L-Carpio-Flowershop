import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

const createTables = async () => {
  // Read the SQL file
  const sqlFile = readFileSync(join(process.cwd(), 'src/server/db/schema.sql'), 'utf8');
  
  // Create a connection with the password in the URL
  const sql = postgres('postgresql://postgres:postgres@localhost:5432/dyiflowershop');
  
  try {
    console.log('Creating tables...');
    await sql.unsafe(sqlFile);
    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await sql.end();
  }
};

createTables().catch(console.error); 