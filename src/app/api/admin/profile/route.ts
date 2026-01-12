import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAdminFromToken } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    email: admin.email,
    role: admin.role || "admin",
  });
}

export async function PUT(req: Request) {
  await connectDB();
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { email } = await req.json();
  admin.email = email;
  await admin.save();

  return NextResponse.json({ message: "Profile updated" });
}