import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const ordersCol = db.collection("orders");
  const orderMgmtCol = db.collection("ordermanagements");

  const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  const now = new Date();
  const endIST = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      18,
      29,
      59,
      999
    )
  );
  const startIST = new Date(endIST.getTime() - 6 * 24 * 60 * 60 * 1000);

  const days: string[] = [];
  const map: Record<string, { revenue: number; orders: number }> = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(startIST.getTime() + i * 86400000);
    const key = d.toISOString().slice(0, 10);
    days.push(key);
    map[key] = { revenue: 0, orders: 0 };
  }

  /* ---------------- ORDERS ---------------- */
  const orders = await ordersCol
    .aggregate([
      { $addFields: { created: { $toDate: "$createdAt" } } },
      {
        $match: {
          created: { $gte: startIST, $lte: endIST },
        },
      },
      {
        $addFields: {
          istDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created",
              timezone: "+05:30",
            },
          },
        },
      },
    ])
    .toArray();

  /* ---------------- ORDER MANAGEMENT ---------------- */
  const orderMgmt = await orderMgmtCol
    .aggregate([
      {
        $match: {
          createdAt: { $gte: startIST, $lte: endIST },
        },
      },
      {
        $addFields: {
          istDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+05:30",
            },
          },
        },
      },
    ])
    .toArray();

  [...orders, ...orderMgmt].forEach((o: any) => {
    if (!map[o.istDate]) return;

    map[o.istDate].orders += 1;

    if (o.status === "Delivered") {
      map[o.istDate].revenue += Number(o.total || o.totalAmount || 0);
    }
  });

  const week = days.map((d) => {
    const day = new Date(d);
    return {
      name: day.toLocaleDateString("en-IN", { weekday: "short" }),
      revenue: map[d].revenue,
      orders: map[d].orders,
    };
  });

  return NextResponse.json(week);
}