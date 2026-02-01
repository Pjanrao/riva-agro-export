import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import {
  findUserById,
  updateUserPasswordById,
} from "@/lib/models/User";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // 🔐 Auth check
    const authUser = await getAuthUser();
    console.log("AUTH USER:", authUser);
    console.log("AUTH USER RAW:", authUser);
console.log("AUTH USER ID:", authUser?.id);
console.log(
  "IS VALID OBJECT ID:",
  authUser?.id && ObjectId.isValid(authUser.id)
)

    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // 🔍 Fetch user
    const user = await findUserById(authUser.id);
    if (!user || !user.password) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 🔑 Verify current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // 🔒 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔄 Update password
    const updated = await updateUserPasswordById(
      authUser.id,
      hashedPassword
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Failed to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Unable to change password" },
      { status: 500 }
    );
  }
}
