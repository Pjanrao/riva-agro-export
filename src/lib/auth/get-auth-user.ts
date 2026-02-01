import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

import jwt from "jsonwebtoken";

type JwtPayload = {
  id?: string;
  userId?: string;
  _id?: string;
  email?: string;
  role?: string;
};

export async function getAuthUser() {
   noStore(); 
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    // ✅ HANDLE ALL POSSIBLE ID KEYS
    const userId =
      decoded.id ||
      decoded.userId ||
      decoded._id;

    if (!userId) {
      console.error("JWT decoded but no user id found:", decoded);
      return null;
    }

    return {
      id: userId.toString(),
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Invalid auth token:", error);
    return null;
  }
}



// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function getAuthUser() {
//   const cookieStore = await cookies(); // ✅ await added
//   const token = cookieStore.get("auth_token")?.value;

//   if (!token) return null;

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     ) as { id: string };

//     return { id: decoded.id };
//   } catch {
//     return null;
//   }
// }
