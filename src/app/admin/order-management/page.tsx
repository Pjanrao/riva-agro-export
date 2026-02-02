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
      const res = await fetch("/api/ordermanagement");
      const data = await res.json();
      setOrders(data);
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

  /* ================= STATUS UPDATE ================= */

  const handleStatusChange = async (
    orderId: string,
    newStatus: AdminOrder["status"]
  ) => {
    const prev = [...orders];

    setOrders((p) =>
      p.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus }
          : o
      )
    );

    try {
      const res = await fetch("/api/ordermanagement", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message);
      }

      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (err: any) {
      setOrders(prev);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          err?.message || "Status update failed",
      });
    }
  };

  /* ================= DELETE ================= */

  const deleteOrder = async (id?: string) => {
    if (!id || !confirm("Delete this order?")) return;

    await fetch("/api/ordermanagement", {
      method: "DELETE",
       headers: {
    "Content-Type": "application/json",
  },
      body: JSON.stringify({ id }),
    });

    setOrders((p) =>
      p.filter((o) => o.id !== id)
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

    const csv = [headers, ...rows]
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

  /* ================= UI ================= */

  return (
    <div className="p-3 sm:p-6 overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-start sm:justify-between mb-4 sm:mb-6 gap-3 w-full">
        <h1 className="text-lg sm:text-2xl font-semibold">
          Orders
        </h1>
        <button
          onClick={() => {
            setMode("add");
            setSelectedOrder(null);
            setOpen(true);
          }}
          className="bg-green-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm ml-auto"
        >
          + Add Order
        </button>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-3 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold">
            Order History
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            View and manage all customer orders.
          </p>

          {/* SEARCH / FILTER / EXPORT */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-2 sm:gap-3">
          <div className="relative w-full sm:w-auto">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="pl-9 pr-3 py-2 border rounded-md text-xs sm:text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as OrderStatus
                )
              }
              className="border rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm"
            >
              <option value="All">Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">
                Confirmed
              </option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">
                Delivered
              </option>
              <option value="Cancelled">
                Cancelled
              </option>
            </select>

            <button
              onClick={exportCSV}
              className="border px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm flex items-center gap-1 sm:gap-2 whitespace-nowrap"
            >
              <Download size={16} />
              Export Data
            </button>          </div>        </div>

        {/* TABLE */}
        <div className="w-full">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground text-xs sm:text-sm">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3">
                  Order ID
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 hidden md:table-cell">
                  Customer
                </th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-3 hidden sm:table-cell">
                  Product
                </th>
                <th className="text-left py-2 sm:py-3 px-1 sm:px-3 hidden sm:table-cell">
                  Qty
                </th>
                <th className="text-left py-2 sm:py-3 px-1 sm:px-3">
                  Status
                </th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-3">
                  Total
                </th>
                <th className="text-center py-2 sm:py-3 px-1 sm:px-3">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-4 sm:py-6 text-xs sm:text-sm"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-b text-xs sm:text-sm">
                    <td className="py-2 sm:py-4 px-2 sm:px-3 font-medium">
                      #{order.id?.slice(-6)}
                    </td>

                    <td className="py-2 sm:py-4 px-2 sm:px-3 hidden md:table-cell">
                      {order.customerName}
                    </td> 

                    <td className="py-2 sm:py-4 px-2 sm:px-3 hidden sm:table-cell">
                      {order.productName}
                    </td>

                    <td className="py-2 sm:py-4 px-1 sm:px-3 hidden sm:table-cell">
                      {order.quantity}
                    </td>

                    <td className="py-2 sm:py-4 px-1 sm:px-3">
                      <select
                        value={order.status}
                        disabled={
                          order.status ===
                            "Delivered" ||
                          order.status ===
                            "Cancelled"
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order.id!,
                            e.target
                              .value as AdminOrder["status"]
                          )
                        }
                        className={`px-1 sm:px-3 py-1 text-xs sm:text-sm rounded-md border font-medium ${
                          statusStyles[
                            order.status as Exclude<
                              OrderStatus,
                              "All"
                            >
                          ]
                        }`}
                      >
                        <option value="Pending">
                          Pending
                        </option>
                        <option value="Confirmed">
                          Confirmed
                        </option>
                        <option value="Shipped">
                          Shipped
                        </option>
                        <option value="Delivered">
                          Delivered
                        </option>
                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    <td className="py-2 sm:py-4 px-2 sm:px-3 text-right font-medium">
                      ₹
                      {order.totalAmount?.toFixed(
                        2
                      )}
                    </td>

                    <td className="py-2 sm:py-4 px-1 sm:px-3 text-center">
                      <div className="flex justify-center gap-1 sm:gap-2">
                        <button
                          onClick={async () => {
                            const full =
                              await fetchOrderById(
                                order.id!
                              );
                            setSelectedOrder(full);
                            setMode("view");
                            setOpen(true);
                          }}
                          className="p-1 sm:p-2 hover:bg-muted rounded-md"
                        >
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                        </button>

                        <button
                          onClick={async () => {
                            const full =
                              await fetchOrderById(
                                order.id!
                              );
                            setSelectedOrder(full);
                            setMode("edit");
                            setOpen(true);
                          }}
                          className="p-1 sm:p-2 hover:bg-muted rounded-md"
                        >
                          <Pencil size={14} className="sm:w-4 sm:h-4" />
                        </button>

                        <button
                          onClick={() =>
                            deleteOrder(order.id)
                          }
                          className="p-1 sm:p-2 hover:bg-muted rounded-md text-red-600"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {filteredOrders.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-3 sm:px-0">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentPage((p) => p - 1)
                }
                disabled={currentPage === 1}
                className="border px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => p + 1)
                }
                disabled={currentPage === totalPages}
                className="border px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
        </div>
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
