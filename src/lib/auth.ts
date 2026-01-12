import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Admin from "@/lib/models/Admin";
import { connectDB } from "@/lib/db";

export async function getAdminFromToken() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      adminId: string;
      tokenVersion: number;
    };

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) return null;

    // 🔥 PERMANENT LOGOUT CHECK
    if (admin.tokenVersion !== decoded.tokenVersion) {
      return null;
    }

    return admin;
  } catch {
    return null;
  }
}