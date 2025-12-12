import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/instances/db";

// get user's orders
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
        o.*,
        COUNT(oi.order_item_id) as item_count,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'product_name', cp.name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN coffee_products cp ON oi.product_id = cp.product_id
      WHERE o.user_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
    `;
    
    const [rows] = await pool.query(query, [parseInt(userId)]);
    
    return NextResponse.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// create new order when user clicks buy now
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, product_id, quantity = 1, shipping_address, payment_method } = body;
    
    if (!user_id || !product_id) {
      return NextResponse.json(
        { success: false, error: "User ID and Product ID are required" },
        { status: 400 }
      );
    }
    
    // get product price
    const [productRows] = await pool.query(
      "SELECT price FROM coffee_products WHERE product_id = ?",
      [product_id]
    );
    
    const product = (productRows as any[])[0];
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    
    const unitPrice = parseFloat(product.price);
    const totalAmount = unitPrice * quantity;
    
    // start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // create order
      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, status) 
         VALUES (?, ?, ?, ?, 'completed')`,
        [user_id, totalAmount, shipping_address || '', payment_method || 'GCash']
      );
      
      const orderId = (orderResult as any).insertId;
      
      // add order item
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, product_id, quantity, unitPrice]
      );
      
      await connection.commit();
      
      return NextResponse.json({
        success: true,
        message: "Order created successfully",
        data: { order_id: orderId }
      }, { status: 201 });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}