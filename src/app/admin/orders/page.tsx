
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

// 'use client';

// import * as React from 'react';
// import { ListFilter, Search, File, Eye } from 'lucide-react';
// import { format } from 'date-fns';
// import { getUsdRate } from "@/lib/getUsdRate";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';

// import { Button } from '@/components/ui/button';

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuCheckboxItem,
// } from '@/components/ui/dropdown-menu';

// import { Input } from '@/components/ui/input';

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';

// import type { Order } from '@/lib/types';
// import { useToast } from '@/hooks/use-toast';

// /* ================= CONSTANTS ================= */

// const ITEMS_PER_PAGE = 5;

// /* ================= STATUS COLORS ================= */

// const statusStyles: Record<Order['status'], string> = {
//   Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
//   Processing: 'bg-blue-100 text-blue-700 border-blue-300',
//   Shipped: 'bg-indigo-100 text-indigo-700 border-indigo-300',
//   Delivered: 'bg-green-100 text-green-700 border-green-300',
//   Cancelled: 'bg-red-100 text-red-700 border-red-300',
// };

// /* ================= PAGE ================= */

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = React.useState<Order[]>([]);
//   const [isLoading, setIsLoading] = React.useState(true);

//   const [search, setSearch] = React.useState('');
//   const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
//   const [currentPage, setCurrentPage] = React.useState(1);

//   const [viewOpen, setViewOpen] = React.useState(false);
//   const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

//   const { toast } = useToast();

//   /* ================= FETCH ================= */

//   const fetchOrders = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch('/api/orders');
//       if (!res.ok) throw new Error();
//       const data = await res.json();

//       setOrders(
//         data.map((o: any) => ({
//           ...o,
//           id: o.id || o._id,
//         }))
//       );
//     } catch {
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: 'Could not fetch orders',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     fetchOrders();
//   }, []);

//   /* ================= FILTER ================= */

//   const filteredOrders = React.useMemo(() => {
//     const query = search.toLowerCase();

//     return orders.filter((order) => {
//       const idMatch = order.id
//         .toString()
//         .toLowerCase()
//         .includes(query);

//       const customerName =
//         typeof order.customerId === 'object'
//           ? order.customerId.fullName
//           : '';

//       const nameMatch = customerName
//         .toLowerCase()
//         .includes(query);

//       const statusMatch =
//         statusFilter.length === 0 ||
//         statusFilter.includes(order.status);

//       return (idMatch || nameMatch) && statusMatch;
//     });
//   }, [orders, search, statusFilter]);

//   /* ================= PAGINATION ================= */

//   const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

//   const paginatedOrders = React.useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
//   }, [filteredOrders, currentPage]);

//   /* ================= UI ================= */
// const customer =
//   selectedOrder &&
//   typeof selectedOrder.customerId === 'object'
//     ? selectedOrder.customerId
//     : null;

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Order History</CardTitle>
//           <CardDescription>
//             View and manage all customer orders.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           {/* FILTER BAR */}
//           <div className="flex flex-col sm:flex-row gap-2 mb-3">
//             <div className="relative">
//               <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
//               <Input
//                 placeholder="Search orders..."
//                 className="pl-7 h-8 text-xs sm:text-sm w-full sm:w-64"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>

//             <div className="sm:ml-auto flex gap-2">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="h-8 text-xs sm:text-sm"
//                   >
//                     <ListFilter className="h-3.5 w-3.5 mr-1" />
//                     Status
//                   </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="end">
//                   <DropdownMenuSeparator />
//                   {Object.keys(statusStyles).map((s) => (
//                     <DropdownMenuCheckboxItem
//                       key={s}
//                       checked={statusFilter.includes(s)}
//                       onCheckedChange={() =>
//                         setStatusFilter((prev) =>
//                           prev.includes(s)
//                             ? prev.filter((v) => v !== s)
//                             : [...prev, s]
//                         )
//                       }
//                     >
//                       {s}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-8 text-xs sm:text-sm"
//               >
//                 <File className="h-3.5 w-3.5 mr-1" />
//                 Export
//               </Button>
//             </div>
//           </div>

//           {/* TABLE */}
//           <Table className="text-[11px] sm:text-sm">
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="px-1 py-0.5 sm:px-4 sm:py-3">
//                   <span className="sm:hidden">ID</span>
//                   <span className="hidden sm:inline">Order ID</span>
//                 </TableHead>

//                 <TableHead className="px-1 py-0.5 sm:px-4 sm:py-3">
//                   Customer
//                 </TableHead>

//                 <TableHead className="px-1 py-0.5 sm:px-4 sm:py-3">
//                   Date
//                 </TableHead>

//                 <TableHead className="px-1 py-0.5 sm:px-4 sm:py-3">
//                   Status
//                 </TableHead>

//                 <TableHead className="px-1 py-0.5 sm:px-4 sm:py-3 text-right sm:text-center">
//                   Total
//                 </TableHead>

//                 <TableHead className="px-1 py-0.5 sm:px-4 sm:py-3 text-right">
//                   Act
//                 </TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-6">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : paginatedOrders.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-6">
//                     No orders found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedOrders.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell className="px-1 py-0.5 sm:px-4 sm:py-3 font-medium">
//                       #{order.id.slice(-6).toUpperCase()}
//                     </TableCell>

//                     <TableCell className="px-1 py-0.5 sm:px-4 sm:py-3">
//                       {typeof order.customerId === 'object'
//                         ? order.customerId.fullName
//                         : '—'}
//                     </TableCell>

//                     <TableCell className="px-1 py-0.5 sm:px-4 sm:py-3">
//                       {format(new Date(order.createdAt), 'dd MMM yyyy')}
//                     </TableCell>

//                     <TableCell className="px-1 py-0.5 sm:px-4 sm:py-3">
//                       <span
//                         className={`px-1.5 py-[2px] sm:px-3 sm:py-1 text-[9px] sm:text-xs rounded-md border font-medium ${statusStyles[order.status]}`}
//                       >
//                         {order.status}
//                       </span>
//                     </TableCell>

//                     <TableCell className="px-1 py-0.5 sm:px-4 sm:py-3 text-right sm:text-center">
//                       ₹{order.total.toFixed(2)}
//                     </TableCell>

//                     <TableCell className="px-1 py-0.5 sm:px-4 sm:py-3 text-right">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => {
//                           setSelectedOrder(order);
//                           setViewOpen(true);
//                         }}
//                       >
//                         <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>

//           {/* PAGINATION */}
//           {totalPages > 1 && (
//             <div className="flex justify-between mt-2 sm:mt-4 text-xs sm:text-sm">
//               <p className="text-muted-foreground">
//                 Page {currentPage} of {totalPages}
//               </p>
//               <div className="flex gap-2">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => p - 1)}
//                 >
//                   Prev
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((p) => p + 1)}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

// {/* VIEW MODAL */}
// <Dialog open={viewOpen} onOpenChange={setViewOpen}>
//   <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto px-3 sm:px-6">
//     <DialogHeader>
//       <DialogTitle className="text-base sm:text-lg font-semibold">
//         Order Details
//       </DialogTitle>
//     </DialogHeader>

//     {selectedOrder && (
//       <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm text-gray-800">

//         {/* ================= CUSTOMER DETAILS ================= */}
//         <section>
//           <h3 className="font-semibold mb-1 sm:mb-2">
//             Customer Details
//           </h3>

//           {customer ? (
//             <div className="space-y-0.5 sm:space-y-1">
//               <p>
//                 <span className="font-medium">Name :</span>{" "}
//                 {customer.fullName}
//               </p>
//               <p>
//                 <span className="font-medium">Email :</span>{" "}
//                 {customer.email}
//               </p>
//               <p>
//                 <span className="font-medium">Contact :</span>{" "}
//                 {customer.contactNo}
//               </p>
//               <p>
//                 <span className="font-medium">Address :</span>{" "}
//                 {customer.address}, {customer.city}, {customer.state},{" "}
//                 {customer.country} - {customer.pin}
//               </p>

//               <p>
//                 <span className="font-medium">Latitude :</span>{" "}
//                 {customer.latitude || "—"}
//               </p>
//               <p>
//                 <span className="font-medium">Longitude :</span>{" "}
//                 {customer.longitude || "—"}
//               </p>
//             </div>
//           ) : (
//             <p className="text-muted-foreground">
//               Customer details not available
//             </p>
//           )}
//         </section>

//         <hr />

//         {/* ================= PRODUCT DETAILS ================= */}
//         <section>
//           <h3 className="font-semibold mb-1 sm:mb-2">
//             Product Details
//           </h3>

//           <div className="space-y-1.5 sm:space-y-2">
//             {selectedOrder.items.map((item, index) => (
//               <div
//                 key={index}
//                 className="
//                   grid grid-cols-2 sm:grid-cols-4
//                   gap-2 sm:gap-4
//                   border rounded-md
//                   p-2 sm:p-3
//                 "
//               >
//                 <div>
//                   <p className="text-muted-foreground">Product</p>
//                   <p>{item.name}</p>
//                 </div>

//                 <div>
//                   <p className="text-muted-foreground">Qty</p>
//                   <p>{item.quantity}</p>
//                 </div>

//                 <div>
//                   <p className="text-muted-foreground">Price</p>
//                   <p>₹{Number(item.price).toFixed(2)}</p>
//                 </div>

//                 <div>
//                   <p className="text-muted-foreground">Subtotal</p>
//                   <p>
//                     ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         <hr />

//         {/* ================= SHIPPING ADDRESS ================= */}
//         <section>
//           <h3 className="font-semibold mb-1 sm:mb-2">
//             Shipping Address
//           </h3>
//           <p className="text-muted-foreground">
//             {selectedOrder.shippingAddress.address},{" "}
//             {selectedOrder.shippingAddress.city},{" "}
//             {selectedOrder.shippingAddress.country} –{" "}
//             {selectedOrder.shippingAddress.zip}
//           </p>
//         </section>

//         <hr />

//         {/* ================= ORDER SUMMARY ================= */}
//         <section>
//           <h3 className="font-semibold mb-1 sm:mb-2">
//             Order Summary
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 sm:gap-y-2">
//             <p>
//               <span className="font-medium">Order ID :</span>{" "}
//               #{selectedOrder.id}
//             </p>
//             <p>
//               <span className="font-medium">Status :</span>{" "}
//               {selectedOrder.status}
//             </p>
//             <p>
//               <span className="font-medium">Order Date :</span>{" "}
//               {new Date(selectedOrder.createdAt).toDateString()}
//             </p>
//             <p>
//               <span className="font-medium">Total Amount :</span>{" "}
//               ₹{selectedOrder.total.toFixed(2)}
//             </p>
//           </div>
//         </section>

//       </div>
//     )}
//   </DialogContent>
// </Dialog>

//     </>
//   );
// }
