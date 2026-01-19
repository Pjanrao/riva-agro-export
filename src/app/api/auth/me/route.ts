import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { findUserById } from "@/lib/models/User";

export async function GET() {
  try {
    // ✅ cookies() is async in Next.js 15
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
) as { userId: string };

const user = await findUserById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const { password, ...safeUser } = user;

    return NextResponse.json(
      { user: safeUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("AUTH ME ERROR:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
