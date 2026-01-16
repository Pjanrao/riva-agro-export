import { NextResponse } from "next/server";
import { getOrdersByUserId } from "@/lib/models/Order";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params; // ✅ await params

    const orders = await getOrdersByUserId(userId);

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("FETCH USER ORDERS ERROR:", error);
    return NextResponse.json([], { status: 200 });
  }
}