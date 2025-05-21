import { db } from "~/server/db";
import { bouquets, bouquetFlowers, bouquetConsumables, rows, rowBouquets } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // Temporarily disabled admin check
    // const session = await auth();
    // if (!session?.userId || session.sessionClaims?.role !== "admin") {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    console.log('Save request body:', JSON.stringify(body, null, 2));

    if (!Array.isArray(body)) {
      throw new Error('Request body must be an array of rows');
    }

    try {
      // Delete data in the correct order to respect foreign key constraints
      console.log('Deleting existing data...');
      await db.delete(bouquetConsumables);
      await db.delete(bouquetFlowers);
      await db.delete(rowBouquets);
      await db.delete(bouquets);
      await db.delete(rows);

      // Insert the new data
      for (const [rowIndex, row] of body.entries()) {
        if (!row?.title) {
          console.log('Skipping row without title:', row);
          continue;
        }
        
        console.log('Processing row:', row.title);
        
        // Insert row
        const [rowResult] = await db.insert(rows)
          .values({ title: row.title })
          .returning({ id: rows.id });
        
        if (!rowResult?.id) {
          throw new Error(`Failed to create row: ${row.title}`);
        }
        
        const rowId = rowResult.id;
        console.log('Created row with ID:', rowId);

        // Process bouquets for this row
        if (!Array.isArray(row.items)) {
          console.log('No items array for row:', row.title);
          continue;
        }

        for (const bouquet of row.items) {
          if (!bouquet?.label || !bouquet?.image || typeof bouquet?.price !== 'number') {
            console.log('Skipping invalid bouquet:', bouquet);
            continue;
          }
          
          console.log('Processing bouquet:', bouquet.label);
          
          // Insert bouquet
          const [bouquetResult] = await db.insert(bouquets)
            .values({
              label: bouquet.label,
              image: bouquet.image,
              price: bouquet.price,
            })
            .returning({ id: bouquets.id });
          
          if (!bouquetResult?.id) {
            throw new Error(`Failed to create bouquet: ${bouquet.label}`);
          }
          
          const bouquetId = bouquetResult.id;
          console.log('Created bouquet with ID:', bouquetId);

          // Create row-bouquet link
          await db.insert(rowBouquets)
            .values({ 
              row_id: rowId, 
              bouquet_id: bouquetId 
            });
          console.log('Created row-bouquet link');

          // Add flowers
          if (bouquet.flowers && typeof bouquet.flowers === 'object') {
            const flowersData = Object.entries(bouquet.flowers)
              .filter(([_, quantity]) => typeof quantity === 'number' && quantity > 0)
              .map(([name, quantity]) => ({
                bouquet_id: bouquetId,
                flower_name: name,
                quantity: Number(quantity),
              }));
            
            if (flowersData.length) {
              await db.insert(bouquetFlowers).values(flowersData);
              console.log('Added flowers:', flowersData);
            }
          }

          // Add consumables
          if (Array.isArray(bouquet.consumables)) {
            const consumablesData = bouquet.consumables
              .filter((name: unknown): name is string => typeof name === 'string')
              .map((name: string) => ({
                bouquet_id: bouquetId,
                consumable_name: name,
              }));
            
            if (consumablesData.length) {
              await db.insert(bouquetConsumables).values(consumablesData);
              console.log('Added consumables:', consumablesData);
            }
          }
        }
      }

      return NextResponse.json({ message: "Saved successfully" });
    } catch (error) {
      console.error('Database operation error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error saving bouquets:', error);
    return NextResponse.json({ 
      error: 'Failed to save bouquets', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}