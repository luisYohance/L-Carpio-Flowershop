import { db } from "~/server/db";
import { flowers } from "~/server/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Temporarily disabled admin check
    // const session = await auth();
    // if (!session?.userId || session.sessionClaims?.role !== "admin") {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const flowerList = await db.select().from(flowers);
    return NextResponse.json(flowerList);
  } catch (error) {
    console.error('Error loading flowers:', error);
    return NextResponse.json({ error: 'Failed to load flowers' }, { status: 500 });
  }
} 