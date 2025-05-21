import { db } from "~/server/db";
import {
  rows,
  bouquets,
  rowBouquets,
  bouquetFlowers,
  bouquetConsumables,
} from "~/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Temporarily disabled admin check
    // const session = await auth();
    // if (!session?.userId || session.sessionClaims?.role !== "admin") {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    console.log('Fetching bouquets data...');
    
    // Get all rows
    const rowsData = await db.select().from(rows);
    console.log('Rows data:', rowsData);

    // Get all row-bouquet relationships
    const rowBouquetsData = await db.select().from(rowBouquets);
    console.log('Row-Bouquets data:', rowBouquetsData);

    // Get all bouquets
    const bouquetsData = await db.select().from(bouquets);
    console.log('Bouquets data:', bouquetsData);

    // Get all bouquet flowers
    const bouquetFlowersData = await db.select().from(bouquetFlowers);
    console.log('Bouquet Flowers data:', bouquetFlowersData);

    // Get all bouquet consumables
    const bouquetConsumablesData = await db.select().from(bouquetConsumables);
    console.log('Bouquet Consumables data:', bouquetConsumablesData);

    // Build the response structure
    const response = rowsData.map(row => {
      // Find bouquets for this row
      const rowBouquetLinks = rowBouquetsData.filter(rb => rb.row_id === row.id);
      const rowBouquets = rowBouquetLinks.map(rb => {
        const bouquet = bouquetsData.find(b => b.id === rb.bouquet_id);
        if (!bouquet) return null;

        // Get flowers for this bouquet
        const flowers = bouquetFlowersData
          .filter(bf => bf.bouquet_id === bouquet.id)
          .reduce((acc, bf) => ({
            ...acc,
            [bf.flower_name]: bf.quantity
          }), {});

        // Get consumables for this bouquet
        const consumables = bouquetConsumablesData
          .filter(bc => bc.bouquet_id === bouquet.id)
          .map(bc => bc.consumable_name);

        return {
          id: bouquet.id,
          label: bouquet.label,
          image: bouquet.image,
          price: bouquet.price,
          flowers,
          consumables
        };
      }).filter(Boolean);

      return {
        id: row.id,
        title: row.title,
        items: rowBouquets
      };
    });

    console.log('Final response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching bouquets:', error);
    return NextResponse.json({ error: 'Failed to fetch bouquets' }, { status: 500 });
  }
}