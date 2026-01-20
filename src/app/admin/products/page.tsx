'use client';

import * as React from 'react';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import type { Product, Category } from '@/lib/types';
import { ProductModal } from '@/components/admin/product-modal';

const ITEMS_PER_PAGE = 5;

export default function AdminProductsPage() {
  const { toast } = useToast();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] =
    React.useState<'all' | 'active' | 'inactive'>('all');

  const [currentPage, setCurrentPage] = React.useState(1);

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] =
    React.useState<'add' | 'edit' | 'view'>('add');
  const [selectedProduct, setSelectedProduct] =
    React.useState<Product | null>(null);

  /* ================= FETCH ================= */

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    setProducts(await res.json());
    setLoading(false);
    setCurrentPage(1);
  };

  React.useEffect(() => {
    fetchProducts();
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
      });
      return;
    }

    toast({ title: 'Product deleted', duration: 2000 });
    fetchProducts();
  };

  /* ================= FILTER ================= */

  const filteredProducts = products
    .filter(
      (p) =>
        statusFilter === 'all' || p.status === statusFilter
    )
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );

  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  /* ================= UI ================= */

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-3xl font-bold">
          Products
        </h1>

        <Button
          size="sm"
          className="h-8 px-5 text-xs sm:h-10 sm:px-6 sm:text-sm bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {
            setMode('add');
            setSelectedProduct(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="px-2 sm:px-6 pt-4">
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as any);
              setCurrentPage(1);
            }}
            className="w-full"
          >
            {/* FILTER ROW */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              {/* LEFT ALIGNED TABS */}
              <TabsList className="flex justify-start gap-1">
                <TabsTrigger value="all">
                  All
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive
                </TabsTrigger>
              </TabsList>

              {/* SEARCH */}
              <div className="relative w-full sm:w-[220px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8 h-8 text-xs sm:h-9 sm:text-sm"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <TabsContent value={statusFilter}>
              {loading ? (
                <div className="py-10 text-center">
                  Loading…
                </div>
              ) : (
                <>
                  {/* TABLE */}
                  <Table className="w-full text-[10px] leading-[1.2] sm:text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-1.5 py-1 sm:px-4 sm:py-3">
                          Img
                        </TableHead>
                        <TableHead className="px-1.5 py-1 sm:px-4 sm:py-3">
                          Name
                        </TableHead>
                        <TableHead className="px-1.5 py-1 sm:px-4 sm:py-3">
                          MOQ
                        </TableHead>
                       <TableHead className="px-1.5 py-1 sm:px-4 sm:py-3 text-right sm:text-center">
  <span className="sm:hidden">Disc</span>
  <span className="hidden sm:inline">Discounted Price</span>
</TableHead>


                        <TableHead className="px-1.5 py-1 sm:px-4 sm:py-3 text-right">
                          MRP
                        </TableHead>
                        <TableHead className="px-1.5 py-1 sm:px-4 sm:py-3">
                          Status
                        </TableHead>
                        <TableHead className="px-1.5 py-1 sm:px-4 sm:py-3 text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedProducts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="px-1.5 py-1 sm:px-4 sm:py-3">
                            <Image
                              src={
                                p.images?.[0] ||
                                '/placeholder.png'
                              }
                              width={20}
                              height={20}
                              alt={p.name}
                              className="sm:w-10 sm:h-10 rounded border object-cover"
                            />
                          </TableCell>

                          <TableCell className="px-1.5 py-1 sm:px-4 sm:py-3 font-medium">
                            {p.name}
                          </TableCell>

                          <TableCell className="px-1.5 py-1 sm:px-4 sm:py-3">
                            {p.minOrderQty || '—'}
                          </TableCell>

                        <TableCell className="px-1.5 py-1 sm:px-4 sm:py-3 text-right sm:text-center">
  ₹{p.discountedPrice ?? 0}
</TableCell>


                          <TableCell className="px-1.5 py-1 sm:px-4 sm:py-3 text-right">
                            ₹{p.sellingPrice ?? 0}
                          </TableCell>

                          <TableCell className="px-1.5 py-1 sm:px-4 sm:py-3">
                            <Badge
                              className={`text-[8px] sm:text-xs px-1 py-0 ${
                                p.status === 'inactive'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {p.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="px-1.5 py-1 sm:px-4 sm:py-3 text-center whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 sm:h-9 sm:w-9"
                              onClick={() => {
                                setSelectedProduct(p);
                                setMode('view');
                                setOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 sm:h-9 sm:w-9"
                              onClick={() => {
                                setSelectedProduct(p);
                                setMode('edit');
                                setOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 sm:h-9 sm:w-9"
                              onClick={() =>
                                handleDelete(p.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* PAGINATION */}
                  {filteredProducts.length >
                    ITEMS_PER_PAGE && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mt-3">
                      <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                        Page {currentPage} of {totalPages}
                      </p>

                      <div className="flex justify-center sm:justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={currentPage === 1}
                          onClick={() =>
                            setCurrentPage((p) => p - 1)
                          }
                        >
                          Previous
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={
                            currentPage === totalPages
                          }
                          onClick={() =>
                            setCurrentPage((p) => p + 1)
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ProductModal
        open={open}
        mode={mode}
        product={selectedProduct}
        categories={categories}
        onClose={() => setOpen(false)}
        onSaved={fetchProducts}
      />
    </div>
  );
}


// 'use client';

// import * as React from 'react';
// import Image from 'next/image';
// import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';

// import {
//   Card,
//   CardContent,
// } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/hooks/use-toast';

// import type { Product, Category } from '@/lib/types';
// import { ProductModal } from '@/components/admin/product-modal';

// /* ================= CONSTANTS ================= */

// const ITEMS_PER_PAGE = 5;

// /* ================= PAGE ================= */

// export default function AdminProductsPage() {
//   const { toast } = useToast();

//   /* ===== data ===== */
//   const [products, setProducts] = React.useState<Product[]>([]);
//   const [categories, setCategories] = React.useState<Category[]>([]);
//   const [loading, setLoading] = React.useState(true);

//   /* ===== filters ===== */
//   const [search, setSearch] = React.useState('');
//   const [statusFilter, setStatusFilter] =
//     React.useState<'all' | 'active' | 'inactive'>('all');

//   /* ===== pagination ===== */
//   const [currentPage, setCurrentPage] = React.useState(1);

//   /* ===== modal ===== */
//   const [open, setOpen] = React.useState(false);
//   const [mode, setMode] =
//     React.useState<'add' | 'edit' | 'view'>('add');
//   const [selectedProduct, setSelectedProduct] =
//     React.useState<Product | null>(null);

//   /* ================= FETCH ================= */

//   const fetchProducts = async () => {
//     setLoading(true);
//     const res = await fetch('/api/products');
//     setProducts(await res.json());
//     setLoading(false);
//     setCurrentPage(1);
//   };

//   React.useEffect(() => {
//     fetchProducts();
//     fetch('/api/categories')
//       .then((r) => r.json())
//       .then(setCategories);
//   }, []);

//   /* ================= DELETE ================= */

//   const handleDelete = async (id: string) => {
//     const ok = confirm('Delete this product?');
//     if (!ok) return;

//     const res = await fetch(`/api/products/${id}`, {
//       method: 'DELETE',
//     });

//     if (!res.ok) {
//       toast({
//         variant: 'destructive',
//         title: 'Delete failed',
//       });
//       return;
//     }

// toast({
//   title: 'Product Added Successfully',
//   duration: 2000, // ⏱️ 2 seconds
// });
//  fetchProducts();
//   };

//   /* ================= FILTER ================= */

//   const filteredProducts = products
//     .filter(
//       (p) =>
//         statusFilter === 'all' || p.status === statusFilter
//     )
//     .filter((p) =>
//       p.name.toLowerCase().includes(search.toLowerCase())
//     );

//   /* ================= PAGINATION ================= */

//   const totalPages = Math.ceil(
//     filteredProducts.length / ITEMS_PER_PAGE
//   );

//   const paginatedProducts = React.useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredProducts.slice(
//       start,
//       start + ITEMS_PER_PAGE
//     );
//   }, [filteredProducts, currentPage]);

//   /* ================= UI ================= */

//   return (
//     <>
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-xl font-semibold">
//             Product List
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Manage products, pricing & visibility
//           </p>
//         </div>

//         <Button
//           className="bg-green-600 hover:bg-green-700 text-white"
//           onClick={() => {
//             setMode('add');
//             setSelectedProduct(null);
//             setOpen(true);
//           }}
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Add Product
//         </Button>
//       </div>

//       {/* TABLE */}
//       <Card>
//         <CardContent className="pt-4">
//           <Tabs
//             value={statusFilter}
//             onValueChange={(v) => {
//               setStatusFilter(v as any);
//               setCurrentPage(1);
//             }}
//           >
//             <div className="flex justify-between mb-3">
//               <TabsList>
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="active">
//                   Active
//                 </TabsTrigger>
//                 <TabsTrigger value="inactive">
//                   Inactive
//                 </TabsTrigger>
//               </TabsList>

//               <div className="relative w-[220px]">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
//                 <Input
//                   className="pl-8 h-9"
//                   placeholder="Search…"
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                 />
//               </div>
//             </div>

//             <TabsContent value={statusFilter}>
//               {loading ? (
//                 <div className="py-10 text-center">
//                   Loading…
//                 </div>
//               ) : (
//                 <>
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Image</TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>MOQ</TableHead>
//                         <TableHead className="text-right">
//                           Discounted
//                         </TableHead>
//                         <TableHead className="text-right">
//                           MRP
//                         </TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead className="text-center">
//                           Actions
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>

//                     <TableBody>
//                       {paginatedProducts.map((p) => (
//                         <TableRow key={p.id}>
//                           <TableCell>
//                             <Image
//                               src={
//                                 p.images?.[0] ||
//                                 '/placeholder.png'
//                               }
//                               width={40}
//                               height={40}
//                               alt={p.name}
//                               className="rounded"
//                             />
//                           </TableCell>

//                           <TableCell className="font-medium">
//                             {p.name}
//                           </TableCell>

//                           <TableCell>
//                             {p.minOrderQty || '—'}
//                           </TableCell>

//                           <TableCell className="text-right">
//                             ₹{p.discountedPrice ?? 0}
//                           </TableCell>

//                           <TableCell className="text-right">
//                             ₹{p.sellingPrice ?? 0}
//                           </TableCell>

//                          <TableCell>
//   <Badge
//     className={
//       p.status === 'inactive'
//         ? 'bg-red-100 text-red-700 hover:bg-red-100'
//         : 'bg-green-100 text-green-700 hover:bg-green-100'
//     }
//   >
//     {p.status}
//   </Badge>
// </TableCell>


//                           <TableCell className="text-center space-x-1">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => {
//                                 setSelectedProduct(p);
//                                 setMode('view');
//                                 setOpen(true);
//                               }}
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>

//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => {
//                                 setSelectedProduct(p);
//                                 setMode('edit');
//                                 setOpen(true);
//                               }}
//                             >
//                               <Pencil className="h-4 w-4 text-blue-600" />
//                             </Button>

//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() =>
//                                 handleDelete(p.id)
//                               }
//                             >
//                               <Trash2 className="h-4 w-4 text-red-600" />
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>

//                   {/* PAGINATION */}
//                   {filteredProducts.length >
//                     ITEMS_PER_PAGE && (
//                     <div className="flex items-center justify-between mt-4">
//                       <p className="text-sm text-muted-foreground">
//                         Page {currentPage} of {totalPages}
//                       </p>

//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           disabled={currentPage === 1}
//                           onClick={() =>
//                             setCurrentPage((p) => p - 1)
//                           }
//                         >
//                           Previous
//                         </Button>

//                         <Button
//                           variant="outline"
//                           size="sm"
//                           disabled={
//                             currentPage === totalPages
//                           }
//                           onClick={() =>
//                             setCurrentPage((p) => p + 1)
//                           }
//                         >
//                           Next
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>

//       {/* PRODUCT MODAL */}
//       <ProductModal
//         open={open}
//         mode={mode}
//         product={selectedProduct}
//         categories={categories}
//         onClose={() => setOpen(false)}
//         onSaved={fetchProducts}
//       />
//     </>
//   );
// }
