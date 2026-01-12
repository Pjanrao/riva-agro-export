import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { getAdminFromToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  await connectDB();
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { oldPassword, newPassword } = await req.json();

  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Old password is incorrect" },
      { status: 400 }
    );
  }

  // ✅ update password
  admin.password = await bcrypt.hash(newPassword, 10);

  // ✅ invalidate all sessions
  admin.tokenVersion += 1;
  await admin.save();

  // 🔥 CLEAR LOGIN COOKIE (THIS FIXES AUTO-LOGIN)
  const cookieStore = await cookies();
  cookieStore.set("admin_token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return NextResponse.json({
    message: "Password updated. Please login again.",
  });
}