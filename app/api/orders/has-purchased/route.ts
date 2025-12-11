import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/instances/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const productId = searchParams.get('product_id');
    
    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, error: "User ID and Product ID are required" },
        { status: 400 }
      );
    }
    
    const [purchaseCheck] = await pool.query(
      `SELECT oi.order_item_id 
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.order_id
       WHERE o.user_id = ? 
         AND oi.product_id = ? 
         AND o.status = 'completed'
       LIMIT 1`,
      [parseInt(userId), parseInt(productId)]
    );
    
    const hasPurchased = (purchaseCheck as any[]).length > 0;
    
    return NextResponse.json({
      success: true,
      hasPurchased
    });
    
  } catch (error) {
    console.error('Error checking purchase:', error);
    return NextResponse.json(
      { success: false, error: "Failed to check purchase status" },
      { status: 500 }
    );
  }
}