'use client';

import * as React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const ITEMS_PER_PAGE = 5;

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { toast } = useToast();

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setCustomers(data);
      } catch {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch customers',
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [toast]);

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);

  const paginatedCustomers = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return customers.slice(start, start + ITEMS_PER_PAGE);
  }, [customers, currentPage]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-3 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Customers
        </h1>
      </div>

      <Card>
        <CardHeader className="py-2 px-3 sm:py-6 sm:px-6">
          <CardTitle className="text-sm sm:text-lg">
            Customer List
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            View and manage registered users.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-2 py-2 sm:px-6 sm:py-6">
          <Table
            className="w-full text-[11px] sm:text-sm"
            style={{ tableLayout: 'fixed' }}   // ⭐ IMPORTANT
          >
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%] py-1">
                  Name
                </TableHead>
                <TableHead className="w-[35%] py-1">
                  Email
                </TableHead>
                <TableHead className="w-[15%] py-1">
                  Role
                </TableHead>
                <TableHead className="w-[15%] py-1 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-1">
                      <Skeleton className="h-3 w-full" />
                    </TableCell>
                    <TableCell className="py-1">
                      <Skeleton className="h-3 w-full" />
                    </TableCell>
                    <TableCell className="py-1">
                      <Skeleton className="h-4 w-14 rounded-full" />
                    </TableCell>
                    <TableCell className="py-1 text-right">
                      <Skeleton className="h-6 w-10 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    {/* NAME */}
                    <TableCell
                      className="py-1 font-medium whitespace-normal break-words"
                      style={{
                        wordBreak: 'normal',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {customer.name}
                    </TableCell>

                    {/* EMAIL */}
                    <TableCell
                      className="py-1 whitespace-normal break-words"
                      style={{
                        wordBreak: 'normal',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {customer.email}
                    </TableCell>

                    {/* ROLE */}
                    <TableCell className="py-1">
                      <Badge
                        className="px-1 py-0 text-[10px]"
                        variant={
                          customer.role === 'Admin'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {customer.role}
                      </Badge>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="py-1 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          asChild
                        >
                          <Link href={`/admin/customers/${customer.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={customer.role === 'Admin'}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>

                         <AlertDialogContent className="max-w-[300px] p-4">
  <AlertDialogHeader className="space-y-1">
    <AlertDialogTitle className="text-sm">
      Delete customer?
    </AlertDialogTitle>
    <AlertDialogDescription className="text-xs">
      This action cannot be undone.
    </AlertDialogDescription>
  </AlertDialogHeader>

  <AlertDialogFooter className="mt-3 gap-2">
    <AlertDialogCancel className="h-7 px-3 text-xs">
      Cancel
    </AlertDialogCancel>
    <AlertDialogAction className="h-7 px-3 text-xs">
      Delete
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>

                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {customers.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center mt-2 text-xs sm:text-sm">
              <p className="text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
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
    </>
  );
}



// 'use client';

// import * as React from 'react';
// import { Eye, Trash2 } from 'lucide-react';
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
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import type { User } from '@/lib/types';
// import { useToast } from '@/hooks/use-toast';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import Link from 'next/link';

// const ITEMS_PER_PAGE = 5;

// export default function AdminCustomersPage() {
//   const [customers, setCustomers] = React.useState<User[]>([]);
//   const [isLoading, setIsLoading] = React.useState(true);
//   const [currentPage, setCurrentPage] = React.useState(1);

//   const { toast } = useToast();

//   const fetchCustomers = React.useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/users');
//       if (!response.ok) throw new Error("Failed to fetch customers");

//       const data = await response.json();
//       setCustomers(data);
//       setCurrentPage(1);
//     } catch {
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: 'Could not fetch customers.',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast]);

//   React.useEffect(() => {
//     fetchCustomers();
//   }, [fetchCustomers]);

//   const handleDelete = async (customerId: string) => {
//     try {
//       const response = await fetch(`/api/users/${customerId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message);
//       }

//       setCustomers((prev) =>
//         prev.filter((customer) => customer.id !== customerId)
//       );

//       setCurrentPage(1);

//       toast({
//         title: '✅ Success',
//         description: 'Customer has been deleted.',
//       });
//     } catch (error: any) {
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: error.message || 'Failed to delete customer.',
//       });
//     }
//   };

//   /* ================= PAGINATION ================= */

//   const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);

//   const paginatedCustomers = React.useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     return customers.slice(start, start + ITEMS_PER_PAGE);
//   }, [customers, currentPage]);

//   return (
//     <>
//       <div className="flex items-center justify-between gap-4 mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">
//           Customers
//         </h1>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Customer List</CardTitle>
//           <CardDescription>
//             View and manage your registered users.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead className="text-right">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {isLoading ? (
//                 Array.from({ length: 4 }).map((_, i) => (
//                   <TableRow key={i}>
//                     <TableCell>
//                       <Skeleton className="h-4 w-32" />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-48" />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-6 w-16 rounded-full" />
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Skeleton className="h-8 w-20" />
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : paginatedCustomers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="text-center">
//                     No customers found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedCustomers.map((customer) => (
//                   <TableRow key={customer.id}>
//                     <TableCell className="font-medium">
//                       {customer.name}
//                     </TableCell>
//                     <TableCell>{customer.email}</TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           customer.role === 'Admin'
//                             ? 'destructive'
//                             : 'secondary'
//                         }
//                       >
//                         {customer.role}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <Button variant="ghost" size="icon" asChild>
//                           <Link
//                             href={`/admin/customers/${customer.id}`}
//                           >
//                             <Eye className="h-4 w-4" />
//                             <span className="sr-only">View</span>
//                           </Link>
//                         </Button>

//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               disabled={
//                                 customer.role === 'Admin'
//                               }
//                             >
//                               <Trash2 className="h-4 w-4" />
//                               <span className="sr-only">
//                                 Delete
//                               </span>
//                             </Button>
//                           </AlertDialogTrigger>

//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>
//                                 Are you absolutely sure?
//                               </AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 This action cannot be undone.
//                                 This will permanently delete
//                                 customer "{customer.name}".
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>

//                             <AlertDialogFooter>
//                               <AlertDialogCancel>
//                                 Cancel
//                               </AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() =>
//                                   handleDelete(customer.id)
//                                 }
//                               >
//                                 Delete
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>

//           {/* PAGINATION UI */}
//           {customers.length > ITEMS_PER_PAGE && (
//             <div className="flex items-center justify-between mt-4">
//               <p className="text-sm text-muted-foreground">
//                 Page {currentPage} of {totalPages}
//               </p>

//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage === 1}
//                   onClick={() =>
//                     setCurrentPage((p) => p - 1)
//                   }
//                 >
//                   Previous
//                 </Button>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setCurrentPage((p) => p + 1)
//                   }
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </>
//   );
// }
