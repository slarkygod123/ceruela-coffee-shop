import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/instances/db";

// get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }
    
    // update query Added profile_picture field
    const query = `
      SELECT 
        r.*,
        u.email as user_email,
        u.profile_picture as profile_picture  -- Add this line
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = ?
      ORDER BY r.review_date DESC
    `;
    
    const [rows] = await pool.query(query, [parseInt(productId)]);
    
    return NextResponse.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// submit a review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, product_id, rating, comment } = body;
    
    if (!user_id || !product_id || !rating) {
      return NextResponse.json(
        { success: false, error: "User ID, Product ID, and Rating are required" },
        { status: 400 }
      );
    }
    
    // check if user already reviewed this product
    const [existing] = await pool.query(
      "SELECT * FROM reviews WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );
    
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "You have already reviewed this product",
          errorType: "ALREADY_REVIEWED" 
        },
        { status: 400 }
      );
    }
    
    // check if user has purchased this product
    const [purchaseCheck] = await pool.query(
      `SELECT oi.order_item_id 
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.order_id
       WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'completed'`,
      [user_id, product_id]
    );
    
    if ((purchaseCheck as any[]).length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "You must purchase this product before reviewing",
          errorType: "PURCHASE_REQUIRED" 
        },
        { status: 403 }
      );
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // add review
      await connection.query(
        "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)",
        [user_id, product_id, rating, comment || null]
      );
      
      // update product rating and review count
      const [ratingData] = await connection.query(
        `SELECT 
          AVG(rating) as avg_rating,
          COUNT(*) as review_count
         FROM reviews 
         WHERE product_id = ?`,
        [product_id]
      );
      
      const data = (ratingData as any[])[0];
      
      await connection.query(
        `UPDATE coffee_products 
         SET rating = ?, review_count = ?
         WHERE product_id = ?`,
        [parseFloat(data.avg_rating).toFixed(1), data.review_count, product_id]
      );
      
      await connection.commit();
      
      return NextResponse.json({
        success: true,
        message: "Review submitted successfully"
      }, { status: 201 });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}