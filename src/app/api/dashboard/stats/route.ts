import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const ordersCol = db.collection("orders");
  const orderMgmtCol = db.collection("ordermanagements");

  /* ================= DATE RANGE ================= */
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  /* ================= STATUS ================= */
  const COMPLETED = ["Delivered"];
  const CANCELLED = ["Cancelled"];

  const ONGOING = [
    "shipped",
    "Shipped",
    "confirmed",
    "Confirmed",
    "processing",
    "Processing",
  ];

  const UPCOMING = ["pending", "Pending"];

  /* ================= COUNTS ================= */
  const [
    ordersCount,
    orderMgmtCount,

    todayOrders,

    completedOrders,
    cancelledOrders,
    ongoingOrders,
    upcomingOrders,

    ordersRevenueAgg,
    orderMgmtRevenueAgg,

    todayOrdersRevenueAgg,
    todayOrderMgmtRevenueAgg,

    customersCount,
    usersCount,
    vendorsCount,

    // ✅ NEW (ADDED – nothing removed)
    totalProducts,
    totalCategories,
  ] = await Promise.all([
    /* TOTAL ORDERS */
    ordersCol.countDocuments(),
    orderMgmtCol.countDocuments(),

    /* TODAY ORDERS */
    Promise.all([
      ordersCol.countDocuments({
        createdAt: {
          $gte: startOfToday.toISOString(),
          $lte: endOfToday.toISOString(),
        },
      }),
      orderMgmtCol.countDocuments({
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }),
    ]).then(([a, b]) => a + b),

    /* COMPLETED */
    Promise.all([
      ordersCol.countDocuments({ status: { $in: COMPLETED } }),
      orderMgmtCol.countDocuments({ status: { $in: COMPLETED } }),
    ]).then(([a, b]) => a + b),

    /* CANCELLED */
    Promise.all([
      ordersCol.countDocuments({ status: { $in: CANCELLED } }),
      orderMgmtCol.countDocuments({ status: { $in: CANCELLED } }),
    ]).then(([a, b]) => a + b),

    /* ONGOING */
    Promise.all([
      ordersCol.countDocuments({ status: { $in: ONGOING } }),
      orderMgmtCol.countDocuments({ status: { $in: ONGOING } }),
    ]).then(([a, b]) => a + b),

    /* UPCOMING */
    Promise.all([
      ordersCol.countDocuments({ status: { $in: UPCOMING } }),
      orderMgmtCol.countDocuments({ status: { $in: UPCOMING } }),
    ]).then(([a, b]) => a + b),

    /* ================= TOTAL REVENUE ================= */
    ordersCol.aggregate([
      { $match: { status: { $in: COMPLETED } } },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $toDouble: { $ifNull: ["$total", 0] } },
          },
        },
      },
    ]).toArray(),

    orderMgmtCol.aggregate([
      { $match: { status: { $in: COMPLETED } } },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $toDouble: { $ifNull: ["$totalAmount", 0] } },
          },
        },
      },
    ]).toArray(),

    /* ================= TODAY REVENUE ================= */
    ordersCol.aggregate([
      { $addFields: { created: { $toDate: "$createdAt" } } },
      {
        $match: {
          status: { $in: COMPLETED },
          created: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $toDouble: { $ifNull: ["$total", 0] } },
          },
        },
      },
    ]).toArray(),

    orderMgmtCol.aggregate([
      {
        $match: {
          status: { $in: COMPLETED },
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $toDouble: { $ifNull: ["$totalAmount", 0] } },
          },
        },
      },
    ]).toArray(),

    /* CLIENTS */
    db.collection("customers").countDocuments(),
    db.collection("users").countDocuments(),

    /* VENDORS */
    db.collection("users").countDocuments({ role: "vendor" }),

    /* ✅ ADDED FOR DASHBOARD */
    db.collection("products").countDocuments(),
    db.collection("categories").countDocuments(),
  ]);

  /* ================= FINAL VALUES ================= */
  const totalOrders = ordersCount + orderMgmtCount;
  const totalClients = customersCount + usersCount;

  const totalRevenue =
    (ordersRevenueAgg[0]?.total || 0) +
    (orderMgmtRevenueAgg[0]?.total || 0);

  const todayRevenue =
    (todayOrdersRevenueAgg[0]?.total || 0) +
    (todayOrderMgmtRevenueAgg[0]?.total || 0);

  const averageOrderValue =
    completedOrders > 0
      ? Math.round(totalRevenue / completedOrders)
      : 0;

  return NextResponse.json({
    totalRevenue,
    todayRevenue,
    averageOrderValue,

    totalOrders,
    todayOrders,

    completedOrders,
    cancelledOrders,
    ongoingOrders,
    upcomingOrders,

    totalClients,
    totalVendors: vendorsCount,

    // ✅ NEW (used by dashboard cards)
    totalProducts,
    totalCategories,
  });
}