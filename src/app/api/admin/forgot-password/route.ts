import { NextResponse } from "next/server";
import crypto from "crypto";
import Admin from "@/lib/models/Admin";
import { connectDB } from "@/lib/db";
import { sendResetPasswordEmail } from "@/lib/sendMail";

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { message: "Email is required" },
      { status: 400 }
    );
  }

  const admin = await Admin.findOne({ email });

  // 🔐 Do NOT reveal if email exists
  if (!admin) {
    return NextResponse.json({
      message: "If the email exists, a reset link has been sent",
    });
  }

  // ✅ Generate raw token
  const token = crypto.randomBytes(32).toString("hex");

  // ✅ Hash token before saving
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  admin.resetPasswordToken = hashedToken;
  admin.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await admin.save();

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${token}`;

  // ✅ Send email
  await sendResetPasswordEmail(admin.email, resetUrl);

  return NextResponse.json({
    message: "If the email exists, a reset link has been sent",
  });
}