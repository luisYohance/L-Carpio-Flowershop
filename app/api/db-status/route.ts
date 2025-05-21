import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { initializeDatabase } from "~/server/db/init";

export async function GET() {
  try {
    // Try to execute a simple query
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: "active" });
  } catch (error: any) {
    console.error("Database connection error:", error);
    
    // If the error is about missing tables, try to initialize the database
    if (error.message?.includes("relation") || error.message?.includes("does not exist")) {
      console.log("Attempting to initialize database...");
      const initialized = await initializeDatabase();
      if (initialized) {
        return NextResponse.json({ status: "initialized" });
      }
    }
    
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
} 