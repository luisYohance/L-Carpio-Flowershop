import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log('Auth session:', session);
    
    if (!session?.userId) {
      console.log('No user ID found in session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('Received order data:', JSON.stringify(body, null, 2));

    const { userEmail, totalPrice, items } = body;

    if (!userEmail || !totalPrice || !items) {
      console.error('Missing required fields:', { userEmail, totalPrice, items });
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: { userEmail, totalPrice, items }
      }, { status: 400 });
    }

    // Validate items structure
    if (!Array.isArray(items) || items.length === 0) {
      console.error('Invalid items format:', items);
      return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.id || !item.label || !item.price || !item.quantity || !item.image) {
        console.error('Invalid item format:', item);
        return NextResponse.json({ 
          error: 'Invalid item format',
          details: { item }
        }, { status: 400 });
      }
    }

    console.log('Attempting to insert order into database...');
    try {
      const order = await db.insert(orders).values({
        user_email: userEmail,
        total_price: totalPrice,
        items: items,
        status: 'pending'
      }).returning();

      console.log('Order saved successfully:', order[0]);
      return NextResponse.json(order[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ 
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving order:', error);
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ 
      error: 'Failed to save order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 