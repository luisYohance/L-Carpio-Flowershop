import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allOrders = await db.select().from(orders).orderBy(orders.created_at);
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error('Error loading orders:', error);
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
  }
} 