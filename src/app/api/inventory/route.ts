import { db } from "~/server/db";
import { flowers, consumables } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Get all inventory data
export async function GET() {
  try {
    console.log('Fetching inventory data...');
    const flowersData = await db.select().from(flowers);
    const consumablesData = await db.select().from(consumables);
    
    console.log('Flowers data:', flowersData);
    console.log('Consumables data:', consumablesData);
    
    return NextResponse.json({
      flowers: flowersData,
      consumables: consumablesData
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

// Update flower quantity
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log('Received PUT request body:', body);
    
    const { name, quantity } = body;

    if (!name || typeof quantity !== 'number') {
      console.error('Invalid input:', { name, quantity });
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // First check if the flower exists
    const existingFlower = await db
      .select()
      .from(flowers)
      .where(eq(flowers.name, name))
      .limit(1);

    if (existingFlower.length > 0) {
      // Update existing flower
      console.log('Updating existing flower:', name);
      await db
        .update(flowers)
        .set({ quantity })
        .where(eq(flowers.name, name));
    } else {
      // Insert new flower
      console.log('Inserting new flower:', name);
      await db
        .insert(flowers)
        .values({ name, quantity });
    }

    // Fetch updated data
    const updatedFlowers = await db.select().from(flowers);
    console.log('Updated flowers data:', updatedFlowers);

    return NextResponse.json({ 
      success: true,
      flowers: updatedFlowers 
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}

// Delete flower
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    console.log('Received DELETE request body:', body);
    
    const { name } = body;

    if (!name) {
      console.error('Invalid input: name is required');
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Delete the flower
    console.log('Deleting flower:', name);
    await db
      .delete(flowers)
      .where(eq(flowers.name, name));

    // Fetch updated data
    const updatedFlowers = await db.select().from(flowers);
    console.log('Updated flowers data:', updatedFlowers);

    return NextResponse.json({ 
      success: true,
      flowers: updatedFlowers 
    });
  } catch (error) {
    console.error('Error deleting flower:', error);
    return NextResponse.json({ error: 'Failed to delete flower' }, { status: 500 });
  }
} 