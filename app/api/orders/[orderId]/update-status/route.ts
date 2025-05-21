import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const { status } = await request.json();
    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }

    const orderId = parseInt(params.orderId);
    if (isNaN(orderId)) {
      return new NextResponse("Invalid order ID", { status: 400 });
    }

    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId));

    return new NextResponse("Order status updated", { status: 200 });
  } catch (error) {
    console.error("[ORDER_STATUS_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 