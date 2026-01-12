"use client";

import {
  Eye,
  Pencil,
  Trash2,
  Download,
  Search,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { OrderModal } from "@/components/admin/order-modal";
import type { AdminOrder } from "@/lib/types";
import type { Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

/* ================= TYPES ================= */

type OrderStatus =
  | "All"
  | "Pending"
  | "Cancelled"
  | "Confirmed"
  | "Shipped"
  | "Delivered";

  
/* ================= CONSTANTS ================= */

const ITEMS_PER_PAGE = 5;

/* ================= STATUS STYLES ================= */

const statusStyles: Record<
  Exclude<OrderStatus, "All">,
  string
> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  // Processing: "bg-blue-100 text-blue-700 border-blue-300",
  Shipped: "bg-indigo-100 text-indigo-700 border-indigo-300",
  Delivered: "bg-green-100 text-green-700 border-green-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [mode, setMode] =
    useState<"add" | "view" | "edit">("add");
  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  /* ===== SEARCH / FILTER / PAGINATION ===== */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<OrderStatus>("All");
  const [currentPage, setCurrentPage] =
    useState(1);

  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/ordermanagement"
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(
        "Failed to fetch orders",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= FETCH SINGLE ================= */

  const fetchOrderById = async (id: string) => {
    const res = await fetch(
      `/api/ordermanagement?id=${id}`
    );
    return await res.json();
  };

  /* ================= DELETE ================= */

  const deleteOrder = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this order?")) return;

    await fetch("/api/ordermanagement", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setOrders((prev) =>
      prev.filter((o) => o.id !== id)
    );
  };

  /* ================= FILTER ================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();

      const matchSearch =
        o.id?.toLowerCase().includes(q) ||
        o.customerName
          ?.toLowerCase()
          .includes(q) ||
        o.productName
          ?.toLowerCase()
          .includes(q);

      const matchStatus =
        statusFilter === "All" ||
        o.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  /* ================= PAGINATION ================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.ceil(
    filteredOrders.length / ITEMS_PER_PAGE
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= EXPORT CSV ================= */

  const exportCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Product",
      "Quantity",
      "Status",
      "Total",
    ];

    const rows = filteredOrders.map((o) => [
      o.id,
      o.customerName,
      o.productName,
      o.quantity,
      o.status,
      o.totalAmount,
    ]);

    const csv =
      [headers, ...rows]
        .map((r) => r.join(","))
        .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

const handleStatusChange = async (
  orderId: string,
  newStatus: AdminOrder["status"]
) => {
  const previousOrders = [...orders];

  // Optimistic UI update
  setOrders((prev) =>
    prev.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    )
  );

  try {
    const res = await fetch("/api/ordermanagement", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        status: newStatus,
      }),
    });

    const data = await res.json();

    // 🔒 Backend lock case (Delivered / Cancelled)
    if (!res.ok) {
      throw new Error(data?.message || "Update failed");
    }

    toast({
      title: "Status Updated",
      description: `Order status changed to ${newStatus}`,
    });
  } catch (error: any) {
    // Rollback on failure
    setOrders(previousOrders);

    toast({
      variant: "destructive",
      title: "Update Failed",
      description:
        error?.message || "Could not update order status",
    });
  }
};



  /* ================= UI ================= */

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Orders
        </h1>
        <button
          onClick={() => {
            setMode("add");
            setSelectedOrder(null);
            setOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
        >
          + Add Order
        </button>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold">
          Order History
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          View and manage all customer orders.
        </p>

        {/* SEARCH / FILTER / EXPORT */}
<div className="flex items-center justify-between mb-4 flex-wrap gap-3">

  {/* LEFT : SEARCH */}
  <div className="relative">
    <Search
      size={16}
      className="absolute left-3 top-2.5 text-muted-foreground"
    />
    <input
      type="text"
      placeholder="Search orders..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-9 pr-3 py-2 border rounded-md text-sm"
    />
  </div>

  {/* RIGHT : STATUS + EXPORT */}
  <div className="flex items-center gap-2">
    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value as OrderStatus)
      }
      className="border rounded-md px-3 py-2 text-sm"
    >
      <option value="All">Status</option>
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>

    <button
      onClick={exportCSV}
      className="border px-3 py-2 rounded-md text-sm flex items-center gap-2"
    >
      <Download size={16} />
      Export Data
    </button>
  </div>
</div>


        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-3">
                  Order ID
                </th>
                <th className="text-left py-3">
                  Customer
                </th>
                <th className="text-left py-3">
                  Product
                </th>
                <th className="text-left py-3">
                  Qty
                </th>
                <th className="text-left py-3">
                  Status
                </th>
                <th className="text-right py-3">
                  Total
                </th>
                <th className="text-center py-3">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6"
                  >
                    Loading orders...
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b"
                  >
                    <td className="py-4 font-medium">
                      #
                      {order.id
                        ?.slice(-6)
                        .toUpperCase()}
                    </td>
                    <td className="py-4">
                      {order.customerName}
                    </td>
                    <td className="py-4">
                      {order.productName}
                    </td>
                    <td className="py-4">
                      {order.quantity}
                    </td>
                    <td className="py-4">
<select
  value={order.status}
  disabled={
    order.status === "Delivered" ||
    order.status === "Cancelled"
  }
  onChange={(e) =>
    handleStatusChange(
      order.id!,
      e.target.value as AdminOrder["status"]
    )
  }
  className={`
    px-3 py-1 text-xs rounded-md border font-medium
    ${statusStyles[order.status as Exclude<OrderStatus, "All">]}
    ${
      order.status === "Delivered" || order.status === "Cancelled"
        ? "cursor-not-allowed opacity-70"
        : "cursor-pointer"
    }
  `}
>
  <option value="Pending">Pending</option>
  <option value="Confirmed">Confirmed</option>
  <option value="Processing">Processing</option>
  <option value="Shipped">Shipped</option>
  <option value="Delivered">Delivered</option>
  <option value="Cancelled">Cancelled</option>
</select>


                    </td>
                    <td className="py-4 text-right font-medium">
                      ₹
                      {order.totalAmount?.toFixed(
                        2
                      )}
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={async () => {
                            const full =
                              await fetchOrderById(
                                order.id!
                              );
                            setSelectedOrder(
                              full
                            );
                            setMode("view");
                            setOpen(true);
                          }}
                          className="p-2 hover:bg-muted rounded-md"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={async () => {
                            const full =
                              await fetchOrderById(
                                order.id!
                              );
                            setSelectedOrder(
                              full
                            );
                            setMode("edit");
                            setOpen(true);
                          }}
                          className="p-2 hover:bg-muted rounded-md"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            deleteOrder(order.id)
                          }
                          className="p-2 hover:bg-muted rounded-md text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <p className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(1, p - 1)
                  )
                }
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : ""
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderModal
        open={open}
        mode={mode}
        data={selectedOrder}
        onClose={() => setOpen(false)}
        onSaved={fetchOrders}
      />
    </div>
  );
}