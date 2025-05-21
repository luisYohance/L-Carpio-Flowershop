import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = parseInt(params.orderId);
    if (isNaN(orderId)) {
      return new NextResponse("Invalid order ID", { status: 400 });
    }

    await db.delete(orders).where(eq(orders.id, orderId));
    return new NextResponse("Order deleted", { status: 200 });
  } catch (error) {
    console.error("[ORDER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 