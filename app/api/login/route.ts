import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/instances/db";
import { isValidHashedPassword } from "@/lib/helper/hash/compare-hash-password";
import { loginSchema } from "@/lib/helper/validation/login-schema";

export type UserTypes = {
  user_ID: number;
  email: string;
  password: string;
  profile_picture: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // validate request body with zod schema
    const parseData = loginSchema.safeParse(body);

    if (!parseData.success) {
      return NextResponse.json(
        {
          errorMessage: "Please check your input and try again.",
          parsedErrors: parseData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
      ("");
    }

    // query the user by email
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = (rows as UserTypes[])[0];

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // compare password with bcrypt
    const isPasswordValid = await isValidHashedPassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { errorMessage: "Invalid password" },
        { status: 401 }
      );
    }

    // successful login
    return NextResponse.json({
      message: "Login successful",
      user: {
        user_ID: user.user_ID,
        email: user.email,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
