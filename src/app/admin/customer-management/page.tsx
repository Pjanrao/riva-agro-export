'use client';

import * as React from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import { CustomerModal, Customer } from '@/components/admin/customer-modal';

const ITEMS_PER_PAGE = 5;

export default function AdminCustomersPage() {
  const { toast } = useToast();

  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('add');
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);

  /* ================= FETCH ================= */

  const fetchCustomers = async () => {
const res = await fetch('/api/customers', {
  cache: 'no-store',
});    const data = await res.json();

    setCustomers(
      data.map((c: any) => ({
        ...c,
        id: c._id,
      }))
    );

    setCurrentPage(1);
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer?')) return;

    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      toast({ variant: 'destructive', title: 'Delete failed' });
      return;
    }

    toast({ title: 'Customer deleted' });
    fetchCustomers();
  };

  /* ================= FILTER ================= */

  const filtered = customers.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <div className="mb-2">
          <h1 className="text-xl font-semibold">Customer Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage customers & contacts
          </p>
        </div>

        {/* ✅ Button width fixed (mobile small, desktop same) */}
        <div className="flex justify-end md:justify-end">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white
                       h-9 px-3 text-sm
                       md:h-10 md:px-4"
            onClick={() => {
              setMode('add');
              setSelectedCustomer(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <Card>
        <CardContent className="pt-4">
          {/* SEARCH */}
          <div className="flex justify-end mb-3">
            <div className="relative w-full md:w-[220px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
              <Input
                className="pl-8 h-9"
                placeholder="Search customer…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* ================= MOBILE TABLE ================= */}
          <div className="md:hidden -mx-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-2 text-xs">Name</TableHead>
                  <TableHead className="px-1 text-xs">Contact</TableHead>
                  <TableHead className="px-1 text-xs">Email</TableHead>
                  <TableHead className="px-1 text-xs">Location</TableHead>
                  <TableHead className="px-1 text-xs text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-2 py-1 text-xs font-medium">
                      {c.fullName}
                    </TableCell>

                    <TableCell className="px-1 py-1 text-xs">
                      {c.contactNo}
                    </TableCell>

                    <TableCell className="px-1 py-1 text-xs break-all leading-tight">
                      {c.email}
                    </TableCell>

                    <TableCell className="px-1 py-1 text-xs">
                      {c.city}
                    </TableCell>

                    {/* ✅ Actions: ONE ROW, smaller icons */}
                    <TableCell className="px-1 py-0 text-center whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setMode('view');
                          setOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setMode('edit');
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3 text-blue-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ================= DESKTOP TABLE (UNCHANGED) ================= */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {c.fullName}
                    </TableCell>
                    <TableCell>{c.contactNo}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>
                      {c.city}, {c.state}
                    </TableCell>
                    <TableCell className="text-center space-x-1">
                       <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setMode('view');
                        setOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                     <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setMode('edit');
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerModal
        open={open}
        mode={mode}
        customer={selectedCustomer}
        onClose={() => setOpen(false)}
        onSaved={fetchCustomers}
      />
    </>
  );
}



// 'use client';

// import * as React from 'react';
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
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/hooks/use-toast';

// import { CustomerModal, Customer } from '@/components/admin/customer-modal';

// /* ================= CONSTANTS ================= */

// const ITEMS_PER_PAGE = 5;

// /* ================= PAGE ================= */

// export default function AdminCustomersPage() {
//   const { toast } = useToast();

//   const [customers, setCustomers] = React.useState<Customer[]>([]);
//   const [search, setSearch] = React.useState('');
//   const [currentPage, setCurrentPage] = React.useState(1);

//   const [open, setOpen] = React.useState(false);
//   const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('add');
//   const [selectedCustomer, setSelectedCustomer] =
//     React.useState<Customer | null>(null);

//   /* ================= FETCH ================= */

// const fetchCustomers = async () => {
//   const res = await fetch('/api/customers');
//   const data = await res.json();

//   setCustomers(
//     data.map((c: any) => ({
//       ...c,
//       id: c._id, // ✅ normalize MongoDB _id → id
//     }))
//   );

//   setCurrentPage(1);
// };

//   React.useEffect(() => {
//     fetchCustomers();
//   }, []);

//   /* ================= DELETE ================= */

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this customer?')) return;

//     const res = await fetch(`/api/customers/${id}`, {
//       method: 'DELETE',
//     });

//     if (!res.ok) {
//       toast({ variant: 'destructive', title: 'Delete failed' });
//       return;
//     }

//     toast({ title: 'Customer deleted' });
//     fetchCustomers();
//   };

//   /* ================= FILTER + PAGINATION ================= */

//   const filtered = customers.filter((c) =>
//     c.fullName.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const paginated = filtered.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   /* ================= UI ================= */

//   return (
//     <>
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-xl font-semibold">Customer Management</h1>
//           <p className="text-sm text-muted-foreground">
//             Manage customers & contacts
//           </p>
//         </div>

//         <Button
//           className="bg-green-600 hover:bg-green-700 text-white"
//           onClick={() => {
//             setMode('add');
//             setSelectedCustomer(null);
//             setOpen(true);
//           }}
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Add Customer
//         </Button>
//       </div>

//       {/* TABLE */}
//       <Card>
//         <CardContent className="pt-4">
//           <div className="flex justify-end mb-3">
//             <div className="relative w-[220px]">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
//               <Input
//                 className="pl-8 h-9"
//                 placeholder="Search customer…"
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//           </div>

//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Contact</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead className="text-center">Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {paginated.map((c) => (
//                 <TableRow key={c.id}>
//                   <TableCell className="font-medium">
//                     {c.fullName}
//                   </TableCell>
//                   <TableCell>{c.contactNo}</TableCell>
//                   <TableCell>{c.email}</TableCell>
//                   <TableCell>
//                     {c.city}, {c.state}
//                   </TableCell>
//                   <TableCell className="text-center space-x-1">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => {
//                         setSelectedCustomer(c);
//                         setMode('view');
//                         setOpen(true);
//                       }}
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>

//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => {
//                         setSelectedCustomer(c);
//                         setMode('edit');
//                         setOpen(true);
//                       }}
//                     >
//                       <Pencil className="h-4 w-4 text-blue-600" />
//                     </Button>

//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleDelete(c.id)}
//                     >
//                       <Trash2 className="h-4 w-4 text-red-600" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           {/* PAGINATION */}
//           {filtered.length > ITEMS_PER_PAGE && (
//             <div className="flex justify-between mt-4">
//               <p className="text-sm text-muted-foreground">
//                 Page {currentPage} of {totalPages}
//               </p>

//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => p - 1)}
//                 >
//                   Previous
//                 </Button>

//                 <Button
//                   variant="outline"
//                   size="sm"
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

//       {/* MODAL */}
//       <CustomerModal
//         open={open}
//         mode={mode}
//         customer={selectedCustomer}
//         onClose={() => setOpen(false)}
//         onSaved={fetchCustomers}
//       />
//     </>
//   );
// }