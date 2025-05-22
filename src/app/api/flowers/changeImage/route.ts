import { db } from "~/server/db";
import { flowers } from "~/server/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // Temporarily disabled admin check
    // const session = await auth();
    // if (!session?.userId || session.sessionClaims?.role !== "admin") {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();

    if (!body.name || typeof body.image !== "string") {
      return NextResponse.json(
        { error: "Invalid flower data" },
        { status: 400 },
      );
    }

    // First, try to get the existing flower
    const existingFlower = await db
      .select()
      .from(flowers)
      .where(eq(flowers.name, body.name));

    if (existingFlower.length > 0 && existingFlower[0]) {
      await db
        .update(flowers)
        .set({ image: body.image })
        .where(eq(flowers.name, body.name));
    } else {
      return NextResponse.json({ error: "Flower not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Flower updated successfully" });
  } catch (error) {
    console.error("Error adding flower:", error);
    return NextResponse.json(
      { error: "Failed to add flower" },
      { status: 500 },
    );
  }
}
