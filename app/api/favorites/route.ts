import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/instances/db";

// get users favorites
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }
    
    const query = `
      SELECT 
        f.*,
        cp.name as product_name,
        cp.description,
        cp.price,
        cp.roast_type,
        cp.origin
      FROM favorites f
      JOIN coffee_products cp ON f.product_id = cp.product_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    
    const [rows] = await pool.query(query, [parseInt(userId)]);
    
    return NextResponse.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, product_id } = body;
    
    if (!user_id || !product_id) {
      return NextResponse.json(
        { success: false, error: "User ID and Product ID are required" },
        { status: 400 }
      );
    }
    
    // Check if already in favorites
    const [existing] = await pool.query(
      "SELECT * FROM favorites WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );
    
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { success: false, error: "Already in favorites" },
        { status: 400 }
      );
    }
    
    // Add to favorites
    await pool.query(
      "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)",
      [user_id, product_id]
    );
    
    return NextResponse.json({
      success: true,
      message: "Added to favorites"
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { success: false, error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
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
    
    await pool.query(
      "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
      [parseInt(userId), parseInt(productId)]
    );
    
    return NextResponse.json({
      success: true,
      message: "Removed from favorites"
    });
    
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { success: false, error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}