// app/api/products/featured/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/instances/db";

export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT 
        cp.*,
        GROUP_CONCAT(DISTINCT pt.tag_name) as tags
      FROM coffee_products cp
      LEFT JOIN product_tags pt ON cp.product_id = pt.product_id
      WHERE cp.is_featured = TRUE
      GROUP BY cp.product_id
      ORDER BY cp.rating DESC
      LIMIT 3
    `;
    
    const [rows] = await pool.query(query);
    
    const products = (rows as any[]).map(row => ({
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      roast: row.roast_type,
      origin: row.origin,
      rating: parseFloat(row.rating),
      review_count: row.review_count
    }));
    
    return NextResponse.json({
      success: true,
      data: products
    });
    
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch featured products' 
      },
      { status: 500 }
    );
  }
}