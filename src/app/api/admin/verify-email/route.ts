import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/lib/models/Admin";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  const admin = await Admin.findOne({
    emailVerifyToken: token,
    emailVerifyExpiry: { $gt: Date.now() },
  });

  if (!admin)
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });

  admin.email = admin.pendingEmail;
  admin.pendingEmail = undefined;
  admin.emailVerifyToken = undefined;
  admin.emailVerifyExpiry = undefined;

  await admin.save();

  return NextResponse.redirect("/admin/profile");
}