// app/api/reviews/featured/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/instances/db";

export interface ReviewRow {
  review_id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  review_date: string | Date;
  user_email: string;
  product_name: string;
  profile_picture?: string | null;
  user_full_name?: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '3';
    
    // UPDATED QUERY: Added profile_picture and name fields
    const query = `
      SELECT 
        r.*,
        u.email as user_email,
        u.profile_picture as profile_picture,  -- ADDED
        cp.name as product_name
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN coffee_products cp ON r.product_id = cp.product_id
      ORDER BY r.review_date DESC
      LIMIT ?
    `;
    
    const [rows] = await pool.query(query, [parseInt(limit)]);
    
    // Format the response
    const reviews = (rows as ReviewRow[]).map(row => ({
      review_id: row.review_id,
      user_id: row.user_id,
      product_id: row.product_id,
      rating: row.rating,
      comment: row.comment,
      review_date: row.review_date,
      user_email: row.user_email,
      product_name: row.product_name,
      profile_picture: row.profile_picture,  // ADDED
      user_name: row.user_email.split('@')[0],  // Use actual name if available
      location: "Philippines"
    }));
    
    return NextResponse.json({
      success: true,
      data: reviews
    });
    
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}