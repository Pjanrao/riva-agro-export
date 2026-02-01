import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/db";
import { resetUserPassword } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const success = await resetUserPassword(hashedToken, password);

    if (!success) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Unable to reset password" },
      { status: 500 }
    );
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";

// import { connectDB } from "@/lib/db";
// import { resetUserPassword } from "@/lib/models/User";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const token = searchParams.get("token");

//     const { password } = await req.json();

//     if (!token || !password) {
//       return NextResponse.json(
//         { message: "Token and password are required" },
//         { status: 400 }
//       );
//     }

//     if (password.length < 6) {
//       return NextResponse.json(
//         { message: "Password must be at least 6 characters" },
//         { status: 400 }
//       );
//     }

//     // 🔒 Hash token to match DB value
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");

//     const success = await resetUserPassword(hashedToken, password);

//     if (!success) {
//       return NextResponse.json(
//         { message: "Invalid or expired reset token" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({
//       message: "Password reset successful. You can now log in.",
//     });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     return NextResponse.json(
//       { message: "Unable to reset password" },
//       { status: 500 }
//     );
//   }
// }
