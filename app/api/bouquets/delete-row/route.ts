import { db } from "~/server/db";
import { bouquets, bouquetFlowers, bouquetConsumables, rows, rowBouquets } from "~/server/db/schema";
import { eq, inArray } from "drizzle-orm";
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
    console.log('Delete row request body:', body);

    if (!body.rowId) {
      // If no rowId, this is an unsaved row - just return success
      return NextResponse.json({ message: "Row deleted successfully" });
    }

    // For saved rows, delete all related data
    try {
      // Get all bouquets in this row
      const rowBouquetLinks = await db.select()
        .from(rowBouquets)
        .where(eq(rowBouquets.row_id, body.rowId));

      const bouquetIds = rowBouquetLinks.map(link => link.bouquet_id);

      if (bouquetIds.length > 0) {
        // Delete all related data
        await db.delete(bouquetConsumables)
          .where(inArray(bouquetConsumables.bouquet_id, bouquetIds));
        
        await db.delete(bouquetFlowers)
          .where(inArray(bouquetFlowers.bouquet_id, bouquetIds));
        
        await db.delete(rowBouquets)
          .where(eq(rowBouquets.row_id, body.rowId));
        
        await db.delete(bouquets)
          .where(inArray(bouquets.id, bouquetIds));
      }

      // Finally delete the row
      await db.delete(rows)
        .where(eq(rows.id, body.rowId));

      return NextResponse.json({ message: "Row deleted successfully" });
    } catch (error) {
      console.error('Error deleting row:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in delete-row endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to delete row', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 