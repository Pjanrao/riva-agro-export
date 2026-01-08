import { NextRequest, NextResponse } from "next/server";
import { getOrdersByUserId } from "@/lib/models/Order";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params; // ✅ FIX

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const orders = await getOrdersByUserId(userId);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
