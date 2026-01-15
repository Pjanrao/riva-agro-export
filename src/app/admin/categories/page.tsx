'use client';

import * as React from 'react';
import Image from 'next/image';
import { PlusCircle, Pencil, Trash2, Eye } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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

import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';

import AddCategoryModal from '@/components/admin/add-category-modal';
import EditCategoryModal from '@/components/admin/edit-category-modal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [readOnly, setReadOnly] = React.useState(false);

  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;

  const { toast } = useToast();

  /* ================= FETCH ================= */

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data);
      setCurrentPage(1);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',  duration: 2000,
        description: 'Failed to fetch categories.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();

      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast({ title: '✅ Category deleted Successfully' , duration: 2000, });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete category.',
      });
    }
  };

  /* ================= FILTER + PAGINATION ================= */

  const filtered = React.useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* ================= UI ================= */

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setOpenAdd(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
          <CardDescription>
            Manage your product categories.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* SEARCH */}
          <Input
            placeholder="Search category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm mb-4"
          />

          {/* TABLE */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((c) => (
                  <TableRow key={c.id}>
                    {/* IMAGE */}
                    <TableCell>
                      {c.image ? (
                        <Image
                          src={c.image}
                          alt={c.name}
                          width={40}
                          height={40}
                          className="rounded border object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded border flex items-center justify-center text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </TableCell>

                    {/* NAME */}
                    <TableCell className="font-medium">
                      {c.name}
                    </TableCell>

                    {/* STATUS */}
                   <TableCell>
  <Badge
    className={
      c.status === 'inactive'
        ? 'bg-red-100 text-red-700 hover:bg-red-100'
        : 'bg-green-100 text-green-700 hover:bg-green-100'
    }
  >
    {c.status}
  </Badge>
</TableCell>


                    {/* FEATURED */}
                    <TableCell>
                      {c.featured ? 'Yes' : 'No'}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedId(c.id);
                            setReadOnly(true);
                            setOpenEdit(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedId(c.id);
                            setReadOnly(false);
                            setOpenEdit(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete “{c.name}”.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(c.id)}
                              >
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

          {/* PAGINATION */}
          {filtered.length > pageSize && (
            <div className="flex justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
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
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => p + 1)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODALS */}
      <AddCategoryModal
        open={openAdd}
        setOpen={setOpenAdd}
        refresh={fetchCategories}
      />

      <EditCategoryModal
        open={openEdit}
        setOpen={setOpenEdit}
        categoryId={selectedId}
        readOnly={readOnly}
        refresh={fetchCategories}
      />
    </>
  );
}
