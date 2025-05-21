import { db } from "~/server/db";
import {
  bouquets,
  bouquetFlowers,
  bouquetConsumables,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, label, image, price, flowers, consumables } = body;

    if (!id || !label || !image || typeof price !== 'number') {
      return NextResponse.json({ error: 'Invalid bouquet data' }, { status: 400 });
    }

    // Update the bouquet
    await db
      .update(bouquets)
      .set({
        label,
        image,
        price,
      })
      .where(eq(bouquets.id, id));

    // Delete existing flowers and consumables
    await db.delete(bouquetFlowers).where(eq(bouquetFlowers.bouquet_id, id));
    await db.delete(bouquetConsumables).where(eq(bouquetConsumables.bouquet_id, id));

    // Add new flowers
    const flowersData = Object.entries(flowers || {}).map(([name, quantity]) => ({
      bouquet_id: id,
      flower_name: name,
      quantity: Number(quantity),
    }));
    if (flowersData.length) {
      await db.insert(bouquetFlowers).values(flowersData);
    }

    // Add new consumables
    const consumablesData = (consumables || []).map((name: string) => ({
      bouquet_id: id,
      consumable_name: name,
    }));
    if (consumablesData.length) {
      await db.insert(bouquetConsumables).values(consumablesData);
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error('Error updating bouquet:', error);
    return NextResponse.json({ error: 'Failed to update bouquet' }, { status: 500 });
  }
} 