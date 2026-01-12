import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderManagement from "@/lib/models/OrderManagement";
import { Types } from "mongoose";

/* ================= HELPERS ================= */

function normalizeId(doc: any) {
  return {
    ...doc,
    id: doc._id.toString(),
  };
}

/* ================= GET ================= */

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    /* ===== SINGLE ORDER ===== */
    if (id) {
      if (!Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid order id" },
          { status: 400 }
        );
      }

      const order = await OrderManagement
        .findById(id)
        .lean<Record<string, any>>(); // ✅ FIX TYPE

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(normalizeId(order));
    }

    /* ===== ORDER LIST ===== */
    const orders = await OrderManagement
      .find()
      .sort({ createdAt: -1 })
      .lean<Record<string, any>[]>(); // ✅ FIX TYPE

    return NextResponse.json(
      orders.map(normalizeId)
    );
  } catch (err) {
    console.error("Order fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const order = await OrderManagement.create(body);

    return NextResponse.json({
      success: true,
      id: order._id.toString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save order" },
      { status: 500 }
    );
  }
}

/* ================= PUT ================= */

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    await OrderManagement.findByIdAndUpdate(body.id, body);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    await OrderManagement.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import OrderManagement from "@/lib/models/OrderManagement";
// import { Types } from "mongoose";

// /* ================= GET ================= */
// export async function GET(req: Request) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     /* ========= SINGLE ORDER (VIEW / EDIT) ========= */
//     if (id) {
//       const order = await OrderManagement.findById(
//         new Types.ObjectId(id)
//       ).lean();

//       if (!order) {
//         return NextResponse.json(
//           { error: "Order not found" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json({
//         ...(order as Record<string, any>),
//         id: (order as any)._id.toString(),
//       });
//     }

//     /* ========= ORDER LIST (TABLE) ========= */
//     const orders = await OrderManagement.find()
//       .sort({ createdAt: -1 })
//       .lean();

//     return NextResponse.json(
//       orders.map((o) => {
//         const doc = o as Record<string, any>;

//         return {
//           id: doc._id.toString(),
//           customerId: doc.customerId,
//           customerName: doc.customerName,
//           productId: doc.productId,
//           productName: doc.productName,
//           quantity: doc.quantity,
//           totalAmount: doc.totalAmount,
//           status: doc.status,
//           createdAt: doc.createdAt,
//         };
//       })
//     );
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Failed to fetch orders" },
//       { status: 500 }
//     );
//   }
// }

// /* ================= POST ================= */
// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     if (
//       !body.customerId ||
//       !body.customerName ||
//       !body.productId ||
//       !body.productName ||
//       !body.quantity ||
//       !body.totalAmount
//     ) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const order = await OrderManagement.create(body);

//     return NextResponse.json({
//       success: true,
//       id: order._id.toString(),
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message || "Failed to save order" },
//       { status: 500 }
//     );
//   }
// }

// /* ================= PUT ================= */
// export async function PUT(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     await OrderManagement.findByIdAndUpdate(body.id, body);

//     return NextResponse.json({ success: true });
//   } catch {
//     return NextResponse.json(
//       { error: "Failed to update order" },
//       { status: 500 }
//     );
//   }
// }

// /* ================= DELETE ================= */
// export async function DELETE(req: Request) {
//   try {
//     await connectDB();
//     const { id } = await req.json();

//     await OrderManagement.findByIdAndDelete(id);

//     return NextResponse.json({ success: true });
//   } catch {
//     return NextResponse.json(
//       { error: "Failed to delete order" },
//       { status: 500 }
//     );
//   }
// }