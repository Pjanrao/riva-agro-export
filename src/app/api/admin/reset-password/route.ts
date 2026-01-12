import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "@/lib/models/Admin";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();

  const { token, password } = await req.json();

  if (!token || !password) {
    return Response.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return Response.json(
      { message: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // ✅ HASH TOKEN before searching
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const admin = await Admin.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!admin) {
    return Response.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  // ✅ Hash new password
  admin.password = await bcrypt.hash(password, 10);
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpires = undefined;
  await admin.save();

  // ✅ Clear auth cookie (force re-login)
  const cookieStore = await cookies();
  cookieStore.set("admin_token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return Response.json({
    message: "Password reset successful",
  });
}