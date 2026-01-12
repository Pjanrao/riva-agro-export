import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/db";
import { findUserByEmail, setResetPasswordToken } from "@/lib/models/User";
import { sendResetPasswordMail } from "@/lib/mail/send-reset-password-mail";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    // 🔐 SECURITY: never reveal user existence
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    }

    // 🔑 Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 🔒 Hash token before storing
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // ⏱ 15 min expiry
    const expire = new Date(Date.now() + 15 * 60 * 1000);

    await setResetPasswordToken(user.id, hashedToken, expire);

    // 🔗 Reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // 📧 Send email
    await sendResetPasswordMail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    return NextResponse.json({
      message:
        "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Unable to process request" },
      { status: 500 }
    );
  }
}
