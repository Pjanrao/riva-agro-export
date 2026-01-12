"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

import type { Customer, Category, Product } from "@/lib/types";

/* ================= HELPERS ================= */

const toNumber = (v: any) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

type Props = {
  open: boolean;
  mode: "add" | "view" | "edit";
  data?: any;
  onClose: () => void;
  onSaved: () => void;
};

const initialForm = {
  customerId: "",
  customerName: "",
  categoryId: "",
  categoryName: "",
  productId: "",
  productName: "",
  hsCode: "",
  minOrderQty: 0,
  discountedPrice: 0,
  quantity: 1,
  shippingCharges: 0,
  taxApplied: false,
  taxAmount: 0,
  latitude: "",
  longitude: "",
  deliveryAddress: "",
  status: "Pending",
  totalAmount: 0,
};

/* ================= COMPONENT ================= */

export function OrderModal({
  open,
  mode,
  data,
  onClose,
  onSaved,
}: any) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [form, setForm] = useState<any>(initialForm);


  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // const [form, setForm] = useState<any>({
  //   customerId: "",
  //   customerName: "",
  //   categoryId: "",
  //   categoryName: "",
  //   productId: "",
  //   productName: "",
  //   hsCode: "",
  //   minOrderQty: 0,
  //   discountedPrice: 0,
  //   quantity: 1,
  //   shippingCharges: 0,
  //   taxApplied: false,
  //   taxAmount: 0,
  //   latitude: "",
  //   longitude: "",
  //   deliveryAddress: "",
  //   status: "Pending",
  //   totalAmount: 0,
  // });

  /* ================= PREFILL (EDIT / VIEW) ================= */

  // useEffect(() => {
  //   if (open && data) {
  //     setForm({
  //       ...form,
  //       ...data,
  //       shippingCharges: data.shippingCharges ?? 0,
  //       discountedPrice: data.discountedPrice ?? 0,
  //       taxApplied: data.taxApplied ?? false,
  //       taxAmount: data.taxAmount ?? 0,
  //       deliveryAddress: data.deliveryAddress ?? "",
  //       latitude: data.latitude ?? "",
  //       longitude: data.longitude ?? "",
  //     });
  //   }
  //   // eslint-disable-next-line
  // }, [open, data]);
useEffect(() => {
  if (!open) return;

  if (mode === "add") {
    setForm(initialForm); // ✅ clear form on Add
    return;
  }

  if (data) {
    setForm({
      ...initialForm,
      ...data,
      // shippingCharges: data.shippingCharges ?? 0,
      // discountedPrice: data.discountedPrice ?? 0,
      // taxApplied: data.taxApplied ?? false,
      // taxAmount: data.taxAmount ?? 0,
      // deliveryAddress: data.deliveryAddress ?? "",
      // latitude: data.latitude ?? "",
      // longitude: data.longitude ?? "",
    });
  }
}, [open, data, mode]);

  /* ================= FETCH MASTER DATA ================= */

  useEffect(() => {
    if (!open || isView) return;

    fetch("/api/customers")
      .then((r) => r.json())
      .then(setCustomers);

    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, [open, isView]);

  /* ================= CATEGORY → PRODUCTS ================= */

 const handleCategoryChange = async (categoryId: string) => {
  const selectedCategory = categories.find(
    (c: any) =>
      c.id === categoryId || c._id === categoryId
  );

  setForm((p: any) => ({
    ...p,
    categoryId,
    categoryName: selectedCategory?.name || "", // ✅ FIX
    productId: "",
    productName: "",
    hsCode: "",
    minOrderQty: 0,
    discountedPrice: 0,
  }));

  if (!categoryId) {
    setProducts([]);
    return;
  }

  const res = await fetch(
    `/api/products?category=${categoryId}`
  );
  setProducts(await res.json());
};


  const handleProductChange = (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;

    setForm((f: any) => ({
      ...f,
      productId: p.id,
      productName: p.name,
      hsCode: p.hsCode || "",
      minOrderQty: toNumber(p.minOrderQty),
      discountedPrice: toNumber(p.discountedPrice),
    }));
  };

  /* ================= TOTAL ================= */

  const subtotal =
    toNumber(form.quantity) *
    toNumber(form.discountedPrice);

  const total =
    subtotal +
    toNumber(form.shippingCharges) +
    (form.taxApplied
      ? toNumber(form.taxAmount)
      : 0);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const payload = {
      ...form,
      quantity: toNumber(form.quantity),
      discountedPrice: toNumber(form.discountedPrice),
      shippingCharges: toNumber(form.shippingCharges),
      taxApplied: form.taxApplied,
      taxAmount: form.taxApplied
        ? toNumber(form.taxAmount)
        : 0,
      totalAmount: total,
    };

    const res = await fetch("/api/ordermanagement", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to save order");
      return;
    }

    onSaved();
    onClose();
  };

  /* ================= VIEW MODE ================= */
if (isView) {
  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="max-w-xl p-0">

        {/* HEADER */}
        <div className="px-5 py-3 border-b flex justify-between items-center">
          <DialogTitle className="text-base">
            Order Details
          </DialogTitle>
         
        </div>

        {/* BODY */}
       {/* BODY */}
<div className="px-5 py-4 text-sm space-y-3">

  {/* SECTION 1 : ORDER + CUSTOMER */}
  <div className="space-y-1">
    <p className="font-semibold">
      Order ID : #{form.id?.slice(-6)}
    </p>
    <p>
      <span className="font-medium">Customer :</span>{" "}
      {form.customerName}
    </p>
  </div>

  <hr className="border-dashed" />

  {/* SECTION 2 : PRODUCT DETAILS */}
  <div className="space-y-1">
    <p>
      <span className="font-medium">Product :</span>{" "}
      {form.productName}
    </p>
    <p>
      <span className="font-medium">Category :</span>{" "}
      {form.categoryName}
    </p>
    <p>
      <span className="font-medium">HS Code :</span>{" "}
      {form.hsCode || "—"}
    </p>
    <p>
      <span className="font-medium">Qty :</span>{" "}
      {form.quantity}
    </p>
  </div>

  <hr className="border-dashed" />

  {/* SECTION 3 : PRICE / STATUS */}
  <div className="grid grid-cols-2 gap-y-2">
    <KV label="Price" value={`₹${form.discountedPrice}`} />
    <KV label="Shipping" value={`₹${form.shippingCharges}`} />
    <KV
      label="Tax"
      value={
        form.taxApplied
          ? `₹${form.taxAmount}`
          : "Not Applied"
      }
    />
    <KV label="Status" value={form.status} />
  </div>

  <hr className="border-dashed" />

  {/* SECTION 4 : DELIVERY + LOCATION */}
  <div className="grid grid-cols-2 gap-4">
    {/* DELIVERY */}
    <div className="space-y-1">
      <p className="font-semibold">Delivery Address</p>
      <p className="text-muted-foreground">
        {form.deliveryAddress?.trim() || "—"}
      </p>
    </div>

    {/* LOCATION */}
    <div className="space-y-1">
      <p className="font-semibold">Location</p>
      <p>Latitude : {form.latitude || "—"}</p>
      <p>Longitude : {form.longitude || "—"}</p>
    </div>
  </div>

  <hr className="border-dashed" />

  {/* TOTAL */}
<div className="flex justify-end">
  <div className="flex items-center gap-3">
    <span className="font-semibold text-black">
      Total Amount :
    </span>
    <span className="font-semibold text-base">
      ₹{Number(form.totalAmount).toFixed(2)}
    </span>
  </div>
</div>


</div>


        {/* FOOTER */}
        <div className="px-5 py-3 border-t flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

  /* ================= ADD / EDIT FORM ================= */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Order" : "Add Order"}
          </DialogTitle>
        </DialogHeader>

        {/* 🔹 FULL FORM RESTORED */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* CUSTOMER */}
          <div className="col-span-2">
            <Label>Customer</Label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={form.customerId}
              onChange={(e) => {
                const c = customers.find(
                  (x) =>
                    String(x._id ?? x.id) === e.target.value
                );
                setForm({
                  ...form,
                  customerId: e.target.value,
                  customerName: c?.fullName || "",
                  deliveryAddress: c?.address || "",
                  latitude: c?.latitude || "",
                  longitude: c?.longitude || "",
                });
              }}
            >
              <option value="">Select Customer</option>
              {customers.map((c, i) => (
                <option
                  key={String(c._id ?? i)}
                  value={String(c._id)}
                >
                  {c.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY */}
          <div>
            <Label>Category</Label>
            <select
              className="w-full border px-3 py-2 rounded-md"
              value={form.categoryId}
              onChange={(e) =>
                handleCategoryChange(e.target.value)
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCT */}
          <div>
            <Label>Product</Label>
            <select
              className="w-full border px-3 py-2 rounded-md"
              value={form.productId}
              onChange={(e) =>
                handleProductChange(e.target.value)
              }
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Min Order Qty</Label>
            <Input disabled value={`${form.minOrderQty} kg`} />
          </div>

          <div>
            <Label>HS Code</Label>
            <Input disabled value={form.hsCode} />
          </div>

          <div>
            <Label>Discounted Price</Label>
            <Input disabled value={form.discountedPrice} />
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min={form.minOrderQty}
              value={form.quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Shipping Charges</Label>
            <Input
              type="number"
              value={form.shippingCharges}
              onChange={(e) =>
                setForm({
                  ...form,
                  shippingCharges: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Tax Applied</Label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={String(form.taxApplied)}
              onChange={(e) =>
                setForm({
                  ...form,
                  taxApplied: e.target.value === "true",
                })
              }
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {form.taxApplied && (
            <div className="col-span-2">
              <Label>Tax Amount</Label>
              <Input
                type="number"
                value={form.taxAmount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    taxAmount: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* LOCATION */}
          <div className="col-span-2">
            <Label>Location</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Latitude"
                value={form.latitude}
                onChange={(e) =>
                  setForm({
                    ...form,
                    latitude: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Longitude"
                value={form.longitude}
                onChange={(e) =>
                  setForm({
                    ...form,
                    longitude: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="col-span-2">
            <Label>Delivery Address</Label>
            <Textarea
              value={form.deliveryAddress}
              onChange={(e) =>
                setForm({
                  ...form,
                  deliveryAddress: e.target.value,
                })
              }
            />
          </div>

          <div className="col-span-2 text-right font-semibold">
            Total Amount : ₹{total.toFixed(2)}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Update" : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================= SMALL COMPONENT ================= */

// function KV({
//   label,
//   value,
// }: {
//   label: string;
//   value?: any;
// }) {
//   return (
//     <div>
//       <p className="text-xs text-muted-foreground">
//         {label}
//       </p>
//       <p className="font-medium">{value}</p>
//     </div>
//   );
// }
function KV({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}