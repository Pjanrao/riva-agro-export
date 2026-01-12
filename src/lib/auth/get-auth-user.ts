import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getAuthUser() {
  const cookieStore = await cookies(); // ✅ await added
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    return { id: decoded.id };
  } catch {
    return null;
  }
}
