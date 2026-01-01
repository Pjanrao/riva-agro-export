'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ImportProductModal } from '@/components/admin/import-product-modal';

/* ================= TYPES ================= */

type ImportProduct = {
  _id: string;
  categoryId: string;
  categoryName: string;
  productName: string;
  totalQuantity: number;
  purchasePrice: number;
  shippingCost: number;
  taxAmount: number;
  images: string[];
};

/* ================= PAGE ================= */

export default function ImportProductPage() {
  const [products, setProducts] = React.useState<ImportProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] =
    React.useState<'add' | 'edit' | 'view'>('add');
  const [selected, setSelected] =
    React.useState<ImportProduct | null>(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;

  /* ================= FETCH ================= */

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/import-products');
    const data = await res.json();
    setProducts(data || []);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* ================= ACTIONS ================= */

  const openAdd = () => {
    setMode('add');
    setSelected(null);
    setOpen(true);
  };

  const openEdit = (row: ImportProduct) => {
    setMode('edit');
    setSelected(row);
    setOpen(true);
  };

  const openView = (row: ImportProduct) => {
    setMode('view');
    setSelected(row);
    setOpen(true);
  };

 const handleDelete = async (id: string) => {
  if (!confirm('Delete this import product?')) return;

  await fetch(`/api/import-products/${id}`, {
    method: 'DELETE',
  });

  fetchProducts();
};


  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Import Product Management
        </h2>
        <Button onClick={openAdd}>+ Import Product</Button>
      </div>

      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-center">Purchase</th>
              <th className="px-4 py-3 text-center">Shipping</th>
              <th className="px-4 py-3 text-center">Tax</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  Loading…
                </td>
              </tr>
            )}

            {!loading && paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  No import products found
                </td>
              </tr>
            )}

            {paginatedProducts.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {p.images?.[0] ? (
                    <Image
                      src={p.images[0]}
                      alt={p.productName}
                      width={40}
                      height={40}
                      className="rounded border object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 border rounded flex items-center justify-center text-xs">
                      N/A
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 font-medium">
                  {p.productName}
                </td>
                <td className="px-4 py-3">
                  {p.categoryName}
                </td>
                <td className="px-4 py-3 text-center">
                  {p.totalQuantity}
                </td>
                <td className="px-4 py-3 text-center">
                  ₹{p.purchasePrice}
                </td>
                <td className="px-4 py-3 text-center">
                  ₹{p.shippingCost}
                </td>
                <td className="px-4 py-3 text-center">
                  ₹{p.taxAmount}
                </td>

                <td className="px-4 py-3 text-center space-x-3">
                  <Eye
                    className="inline h-4 w-4 cursor-pointer"
                    onClick={() => openView(p)}
                  />
                  <Pencil
                    className="inline h-4 w-4 cursor-pointer text-blue-600"
                    onClick={() => openEdit(p)}
                  />
                  <Trash2
                    className="inline h-4 w-4 cursor-pointer text-red-600"
                    onClick={() => handleDelete(p._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <ImportProductModal
        open={open}
        mode={mode}
        data={selected}
        onClose={() => setOpen(false)}
        onSaved={fetchProducts}
      />
    </div>
  );
}
