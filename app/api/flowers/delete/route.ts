import { db } from "~/server/db";
import { flowers } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: Request) {
  try {
    // Temporarily disabled admin check
    // const session = await auth();
    // if (!session?.userId || session.sessionClaims?.role !== "admin") {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    console.log('Delete flower request body:', body);

    if (!body.name) {
      return NextResponse.json({ error: 'Flower name is required' }, { status: 400 });
    }

    await db.delete(flowers).where(eq(flowers.name, body.name));

    return NextResponse.json({ message: "Flower deleted successfully" });
  } catch (error) {
    console.error('Error deleting flower:', error);
    return NextResponse.json({ error: 'Failed to delete flower' }, { status: 500 });
  }
} 