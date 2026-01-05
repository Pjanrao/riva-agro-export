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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">
            Banner Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage website banners & visibility
          </p>
        </div>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
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
      <Card>
        <CardContent className="pt-4">
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as any);
              setCurrentPage(1);
            }}
          >
            <div className="flex justify-between mb-3">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">
                  Active
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive
                </TabsTrigger>
              </TabsList>

              <div className="relative w-[220px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
                <Input
                  className="pl-8 h-9"
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedBanners.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell>
                            <Image
                              src={b.image}
                              width={60}
                              height={40}
                              alt={b.heading}
                              className="rounded object-cover"
                            />
                          </TableCell>

                          <TableCell className="font-medium">
                            {b.heading}
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline">
                              {b.position}
                            </Badge>
                          </TableCell>

                          <TableCell>{b.order}</TableCell>

                          <TableCell>
                            <Badge>{b.status}</Badge>
                          </TableCell>

                          <TableCell className="text-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedBanner(b);
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
                                setSelectedBanner(b);
                                setMode('edit');
                                setOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDelete(b.id)
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
                  {filteredBanners.length >
                    ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
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
