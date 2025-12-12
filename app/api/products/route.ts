import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/instances/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); 
    const roast = searchParams.get('roast');
    const origin = searchParams.get('origin');
    const featured = searchParams.get('featured');
    
    let query = `
      SELECT 
        cp.*,
        GROUP_CONCAT(DISTINCT pt.tag_name) as tags
      FROM coffee_products cp
      LEFT JOIN product_tags pt ON cp.product_id = pt.product_id
    `;
    
    const conditions = [];
    const params = [];
    
    // handle single product fetch by ID
    if (id) {
      conditions.push('cp.product_id = ?');
      params.push(parseInt(id));
    }
    
    // add other filters only if not fetching single product
    if (!id) {
      if (roast && roast !== 'all') {
        conditions.push('cp.roast_type = ?');
        params.push(roast);
      }
      
      if (origin && origin !== 'all') {
        conditions.push('cp.origin = ?');
        params.push(origin);
      }
      
      if (featured === 'true') {
        conditions.push('cp.is_featured = TRUE');
      }
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    if (!id) {
      query += ' GROUP BY cp.product_id ORDER BY cp.is_featured DESC, cp.name ASC';
    }
    
    const [rows] = await pool.query(query, params);
    
    // format the response
    const products = (rows as any[]).map(row => ({
      id: row.product_id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      roast: row.roast_type,
      origin: row.origin,
      weight: row.weight || '250g',
      tags: row.tags ? row.tags.split(',') : [],
      rating: parseFloat(row.rating),
      reviews: row.review_count,
      inStock: Boolean(row.in_stock),
      isFeatured: Boolean(row.is_featured)
    }));
    
    // ff fetching single product, return the first one only
    const responseData = id ? (products.length > 0 ? products[0] : null) : products;
    
    return NextResponse.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    );
  }
}