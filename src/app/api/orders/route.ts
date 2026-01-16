import { NextRequest, NextResponse } from "next/server";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "@/lib/models/Order";
import type { Order as OrderType } from "@/lib/types";

/* ======================================================
   GET HANDLER
   - /api/orders            → get all orders
   - /api/orders?id=ORDERID → get single order
====================================================== */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (orderId) {
      const order = await getOrderById(orderId);

      if (!order) {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(order, { status: 200 });
    }

    const orders = await getOrders();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/* ======================================================
   POST HANDLER  🔥 FIXED TOTAL LOGIC
   - /api/orders → create new order
====================================================== */

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    if (
      !orderData?.userId ||
      !orderData?.items ||
      orderData.items.length === 0
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ FIX: Store PRICE IN USD ONLY
    const safeItems = orderData.items.map((item: any) => ({
      ...item,
      price: Number(item.price),      // MUST be 60.88 (USD)
      quantity: Number(item.quantity) || 1,
    }));

    const safeOrderData = {
      ...orderData,
      items: safeItems,
      currency: "USD" as const,       // IMPORTANT
    };

    const newOrder = await createOrder(safeOrderData);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Create order failed:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}

/* ======================================================
   PUT HANDLER
   - /api/orders?id=ORDERID → update order status
====================================================== */

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const existingOrder = await getOrderById(orderId);

    if (!existingOrder) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (existingOrder.status === "Delivered") {
      return NextResponse.json(
        { message: "Delivered orders cannot be updated" },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderStatus(orderId, status);

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { message: "Failed to update order status" },
      { status: 500 }
    );
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import {
//   createOrder,
//   getOrders,
//   getOrderById,
//   updateOrderStatus,
// } from "@/lib/models/Order";
// import type { Order as OrderType } from "@/lib/types";


// /* ======================================================
//    GET HANDLER
//    - /api/orders            → get all orders
//    - /api/orders?id=ORDERID → get single order
// ====================================================== */

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const orderId = searchParams.get("id");

//     // 🔹 GET SINGLE ORDER
//     if (orderId) {
//       const order = await getOrderById(orderId);

//       if (!order) {
//         return NextResponse.json(
//           { message: "Order not found" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json(order, { status: 200 });
//     }

//     // 🔹 GET ALL ORDERS
//     const orders = await getOrders();
//     return NextResponse.json(orders, { status: 200 });
//   } catch (error) {
//     console.error("Failed to fetch orders:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch orders" },
//       { status: 500 }
//     );
//   }
// }

// /* ======================================================
//    POST HANDLER
//    - /api/orders → create new order
// ====================================================== */

// export async function POST(req: NextRequest) {
//   try {
//     const orderData: Omit<OrderType, "id" | "_id" | "createdAt"> =
//       await req.json();

//     // 🔍 Basic validation
//     if (
//       !orderData ||
//       !orderData.userId ||
//       !orderData.items ||
//       orderData.items.length === 0 ||
//       !orderData.total
//     ) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const newOrder = await createOrder(orderData);
//     return NextResponse.json(newOrder, { status: 201 });
//   } catch (error) {
//     console.error("Failed to create order:", error);
//     return NextResponse.json(
//       { message: "Failed to create order" },
//       { status: 500 }
//     );
//   }
// }

// /* ======================================================
//    PUT HANDLER
//    - /api/orders?id=ORDERID → update order status
// ====================================================== */

// export async function PUT(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const orderId = searchParams.get("id");

//     if (!orderId) {
//       return NextResponse.json(
//         { message: "Order ID is required" },
//         { status: 400 }
//       );
//     }

//     const { status } = await req.json();

//     if (!status) {
//       return NextResponse.json(
//         { message: "Status is required" },
//         { status: 400 }
//       );
//     }

//     // 🔒 LOCK DELIVERED ORDERS (extra safety)
//     const existingOrder = await getOrderById(orderId);

//     if (!existingOrder) {
//       return NextResponse.json(
//         { message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     if (existingOrder.status === "Delivered") {
//       return NextResponse.json(
//         { message: "Delivered orders cannot be updated" },
//         { status: 400 }
//       );
//     }

//     const updatedOrder = await updateOrderStatus(orderId, status);

//     return NextResponse.json(updatedOrder, { status: 200 });
//   } catch (error) {
//     console.error("Failed to update order status:", error);
//     return NextResponse.json(
//       { message: "Failed to update order status" },
//       { status: 500 }
//     );
//   }
// }