// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/instances/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required"
      }, { status: 400 });
    }

    const [users] = await pool.execute(
      'SELECT user_ID, email, profile_picture FROM users WHERE user_ID = ?',
      [userId]
    );

    const userArray = users as any[];
    
    if (userArray.length === 0) {
      return NextResponse.json({
        success: false,
        error: "User not found"
      }, { status: 404 });
    }

    const user = userArray[0];

    return NextResponse.json({
      success: true,
      data: {
        userId: user.user_ID,
        email: user.email,
        profile_picture: user.profile_picture,
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Fetch failed'
    }, { status: 500 });
  }
}