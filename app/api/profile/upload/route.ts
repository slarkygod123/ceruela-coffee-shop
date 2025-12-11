// app/api/profile/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/cloudinary';
import pool from '@/lib/instances/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: "No file provided" 
      }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "User ID is required" 
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;
    
    const publicId = file.name.split(".")[0];
    
    const url = await cloudinary.uploader.upload(dataUri, {
      folder: `${process.env.UPLOAD_USER_PROFILE_PICTURE}`, 
      public_id: publicId,
    });
    
    // Update the profile_picture in the users table
    await pool.execute(
      'UPDATE users SET profile_picture = ? WHERE user_ID = ?',
      [url.secure_url, userId] // Use secure_url for HTTPS
    );

    return NextResponse.json({
      success: true,
      data: {
        url: url.secure_url, // Return the secure URL
        user_id: userId
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }, { status: 500 });
  }
}