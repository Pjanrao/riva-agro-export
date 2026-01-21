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

import { BannerModal } from '@/components/admin/banner-modal';

/* ================= CONSTANTS ================= */

const ITEMS_PER_PAGE = 5;

/* ================= TYPES ================= */

export interface Banner {
  id: string;

  heading: string;
  subHeading?: string;

  image: string;

  button1Text: string;
  button1Link: string;

  button2Text?: string;
  productId?: string; // ✅ THIS FIXES THE ERROR

  position: 'HOME' | 'BRAND' | 'CATEGORY';
  order: number;
  status: 'active' | 'inactive';
}

/* ================= PAGE ================= */

export default function AdminBannerPage() {
  const { toast } = useToast();

  const [banners, setBanners] = React.useState<Banner[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] =
    React.useState<'all' | 'active' | 'inactive'>('all');

  const [currentPage, setCurrentPage] = React.useState(1);

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] =
    React.useState<'add' | 'edit' | 'view'>('add');
  const [selectedBanner, setSelectedBanner] =
    React.useState<Banner | null>(null);

  /* ================= FETCH ================= */

const fetchBanners = async () => {
  setLoading(true);

  const res = await fetch('/api/banners');
  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error('Expected banners array, got:', data);
    setBanners([]);
    setLoading(false);
    return;
  }

  // ✅ API already returns `id`
  setBanners(data);

  setLoading(false);
};

  React.useEffect(() => {
    fetchBanners();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    const ok = confirm('Delete this banner?');
    if (!ok) return;

    const res = await fetch(`/api/banners/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
      });
      return;
    }

    toast({ title: 'Banner deleted' });
    fetchBanners();
  };

  /* ================= FILTER ================= */

  const filteredBanners = banners
    .filter(
      (b) =>
        statusFilter === 'all' || b.status === statusFilter
    )
    .filter((b) =>
      b.heading.toLowerCase().includes(search.toLowerCase())
    );

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(
    filteredBanners.length / ITEMS_PER_PAGE
  );

  const paginatedBanners = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBanners.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredBanners, currentPage]);

  /* ================= UI ================= */

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between mb-4 w-full gap-3 sm:gap-4" >
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
            Banner Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage website banners & visibility
          </p>
        </div>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white w-auto text-sm sm:text-base h-9 sm:h-10 ml-auto"
          onClick={() => {
            setMode('add');
            setSelectedBanner(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* TABLE */}
      <div className="w-full">

      <Card className="">
        <CardContent className="pt-4">
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as any);
              setCurrentPage(1);
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 mb-3">
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="inactive">
                    Inactive
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative w-full sm:w-[220px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  className="pl-8 h-9 text-sm"
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
                <div className="py-5 text-center">
                  Loading…
                </div>
              ) : (
<div className="relative w-full overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <Table className="w-full text-xs sm:text-sm [&_th]:px-2 sm:[&_th]:px-3 [&_td]:px-2 sm:[&_td]:px-3 [&_th]:py-2 [&_td]:py-2 [&_th]:text-left">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10 sm:w-12">Image</TableHead>
                          <TableHead className="min-w-[120px] sm:w-[120px] md:w-[100px]">Title</TableHead>
                          <TableHead className="hidden md:table-cell w-16 text-center">
                            Order
                          </TableHead>
                          <TableHead className="w-20 sm:w-24">Status</TableHead>
                          <TableHead className="text-center w-20 sm:w-24">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {paginatedBanners.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="w-10 sm:w-12 shrink-0">
                              <Image
                                src={b.image}
                                width={40}
                                height={32}
                                alt={b.heading}
                                className="rounded object-cover"
                              />
                            </TableCell>

                            <TableCell className="min-w-[120px] sm:w-[120px] md:w-[100px]">
                              <p className="text-xs sm:text-sm font-medium truncate max-w-[110px] sm:max-w-[110px] md:max-w-[90px]">
                                {b.heading}
                              </p>
                            </TableCell>

                            <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                              {b.order}
                            </TableCell>

                            <TableCell className="w-20 sm:w-24">
                              <Badge className="px-2 py-0.5 text-xs rounded-full whitespace-nowrap">
                                {b.status}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-center w-20 sm:w-24">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 p-0"
                                  onClick={() => {
                                    setSelectedBanner(b);
                                    setMode('view');
                                    setOpen(true);
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 p-0"
                                  onClick={() => {
                                    setSelectedBanner(b);
                                    setMode('edit');
                                    setOpen(true);
                                  }}
                                >
                                  <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleDelete(b.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* PAGINATION */}
                  {filteredBanners.length >
                    ITEMS_PER_PAGE && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 px-4 sm:px-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          className="text-xs sm:text-sm h-8 sm:h-9"
                          onClick={() =>
                            setCurrentPage((p) => p - 1)
                          }
                        >
                          Previous
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            currentPage === totalPages
                          }
                          className="text-xs sm:text-sm h-8 sm:h-9"
                          onClick={() =>
                            setCurrentPage((p) => p + 1)
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>

      {/* MODAL */}
      <BannerModal
        open={open}
        mode={mode}
        banner={selectedBanner}
        onClose={() => setOpen(false)}
        onSaved={fetchBanners}
      />
    </>
  );
} 