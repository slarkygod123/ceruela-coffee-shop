import { hashPassword } from "@/lib/helper/hash/create-hash-password";
import { registerationSchema } from "@/lib/helper/validation/register-schema";
import pool from "@/lib/instances/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // validate request body with Zod schema
    const parseData = registerationSchema.safeParse(body);
    
    if (!parseData.success) {
      return NextResponse.json(
        { errorMessage: "Please check your input and try again.", parsedErrors: parseData.error.flatten().fieldErrors },
        { status: 400 }
      );
''  }

    // check if user already exists
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [parseData.data.email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // hash the password
    const hashedPassword = await hashPassword(parseData.data.password);

    // insert new user
    await pool.query(
      "INSERT INTO users (email, password, profile_picture) VALUES (?, ?, ?)",
      [parseData.data.email, hashedPassword, null]
    );

    return NextResponse.json({
      successMessage: "User registered successfully",

    });
  } catch (error: unknown) {
    return NextResponse.json(
      { errorMessage: `${error instanceof Error ? error.message : "Failed to register"}` },
      { status: 500 }
    );
  }
}
