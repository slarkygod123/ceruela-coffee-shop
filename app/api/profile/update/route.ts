// app/api/profile/update/route.ts - Improved version
import { isValidHashedPassword } from '@/lib/helper/hash/compare-hash-password';
import { hashPassword } from '@/lib/helper/hash/create-hash-password';
import pool from '@/lib/instances/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const { userId, email, currentPassword, newPassword } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required"
      }, { status: 400 });
    }

    // Get current user data
    const [users] = await pool.execute(
      'SELECT email, password FROM users WHERE user_ID = ?',
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
    const updates: string[] = [];
    const values: any[] = [];

    // Update email if provided and changed
    if (email && email !== user.email) {
      // Check if email already exists
      const [existing] = await pool.execute(
        'SELECT user_ID FROM users WHERE email = ? AND user_ID != ?',
        [email, userId]
      );

      if ((existing as any[]).length > 0) {
        return NextResponse.json({
          success: false,
          error: "Email already in use"
        }, { status: 400 });
      }

      updates.push('email = ?');
      values.push(email);
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await isValidHashedPassword(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json({
          success: false,
          error: "Current password is incorrect"
        }, { status: 400 });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    // If there are updates to make
    if (updates.length > 0) {
      values.push(userId);
      
      await pool.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE user_ID = ?`,
        values
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Update failed'
    }, { status: 500 });
  }
}