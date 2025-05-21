import { db } from "~/server/db";
import {
  bouquets,
  bouquetFlowers,
  bouquetConsumables,
  rowBouquets,
} from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rowId = searchParams.get('rowId');
    const bouquetId = searchParams.get('bouquetId');

    console.log('Getting bouquet with params:', { rowId, bouquetId });

    if (!rowId || !bouquetId) {
      return NextResponse.json({ error: 'Row ID and Bouquet ID are required' }, { status: 400 });
    }

    // First check if the bouquet exists in rowBouquets
    const rowBouquetData = await db
      .select()
      .from(rowBouquets)
      .where(
        and(
          eq(rowBouquets.row_id, Number(rowId)),
          eq(rowBouquets.bouquet_id, Number(bouquetId))
        )
      );

    console.log('Found row bouquet data:', rowBouquetData);

    if (!rowBouquetData.length) {
      return NextResponse.json({ error: 'Bouquet not found in row' }, { status: 404 });
    }

    // Get the bouquet
    const bouquetData = await db
      .select()
      .from(bouquets)
      .where(eq(bouquets.id, Number(bouquetId)))
      .limit(1);

    console.log('Found bouquet data:', bouquetData);

    if (!bouquetData.length) {
      return NextResponse.json({ error: 'Bouquet not found' }, { status: 404 });
    }

    const bouquet = bouquetData[0];
    if (!bouquet) {
      return NextResponse.json({ error: 'Bouquet data is invalid' }, { status: 500 });
    }

    // Get the flowers
    const flowers = await db
      .select()
      .from(bouquetFlowers)
      .where(eq(bouquetFlowers.bouquet_id, bouquet.id));

    console.log('Found flowers:', flowers);

    // Get the consumables
    const consumables = await db
      .select()
      .from(bouquetConsumables)
      .where(eq(bouquetConsumables.bouquet_id, bouquet.id));

    console.log('Found consumables:', consumables);

    return NextResponse.json({
      id: bouquet.id,
      label: bouquet.label,
      image: bouquet.image,
      price: bouquet.price,
      flowers: Object.fromEntries(flowers.map((f) => [f.flower_name, f.quantity])),
      consumables: consumables.map((c) => c.consumable_name),
    });
  } catch (error) {
    console.error('Error getting bouquet:', error);
    return NextResponse.json({ error: 'Failed to get bouquet' }, { status: 500 });
  }
} 