import { db } from "~/server/db";
import { flowers } from "~/server/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { object } from "zod";

export async function POST(req: Request) {
  try {
    // Temporarily disabled admin check
    // const session = await auth();
    // if (!session?.userId || session.sessionClaims?.role !== "admin") {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const body = await req.json();

    if (Array.isArray(body)) {
      var toset: { [key: string]: number } = {};
      var success = "true";

      for (const flower of body) {
        if (success == "true") {
          const existingFlower = await db
            .select()
            .from(flowers)
            .where(eq(flowers.name, flower.name));
          if (
            existingFlower.length > 0 &&
            existingFlower[0] &&
            existingFlower[0].quantity >= flower.quantity
          ) {
            toset[flower.name] = existingFlower[0].quantity - flower.quantity;
          } else {
            success = "false";
            break;
          }
        }
      }

      if (success === "true") {
        Object.entries(toset).forEach(async ([name, quantity]) => {
          await db
            .update(flowers)
            .set({ quantity: quantity })
            .where(eq(flowers.name, name));
        });
      }

      return NextResponse.json({
        message:
          success == "true"
            ? "Flower updated successfully"
            : "Flower does not exist or insufficient quantity",
        success: success,
      });
    } else {
      if (
        !body.name ||
        typeof body.quantity !== "number" ||
        body.quantity < 0
      ) {
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

      if (
        existingFlower.length > 0 &&
        existingFlower[0] &&
        existingFlower[0].quantity >= body.quantity
      ) {
        // If flower exists, update its quantity
        await db
          .update(flowers)
          .set({ quantity: existingFlower[0].quantity - body.quantity })
          .where(eq(flowers.name, body.name));
      } else {
        return NextResponse.json({
          message: "Flower does not exist or insufficient quantity",
        });
      }
    }

    return NextResponse.json({ message: "Flower updated successfully" });
  } catch (error) {
    console.error("Error taking flower:", error);
    return NextResponse.json(
      { error: "Failed to take flower" },
      { status: 500 },
    );
  }
}
