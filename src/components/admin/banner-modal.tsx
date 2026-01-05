'use client';

import * as React from 'react';
import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import type { Banner } from '@/app/admin/banner-management/page';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

/* ================= TYPES ================= */

type BannerForm = {
  heading: string;
  subHeading: string;
  image: string;

  button1Text: string;
  button1Link: string;

  button2Text: string;
  productId: string; // 'none' | productId

  order: number;
  status: 'active' | 'inactive';
};

interface Props {
  open: boolean;
  mode: 'add' | 'edit' | 'view';
  banner: Banner | null;
  onClose: () => void;
  onSaved: () => void;
}

/* ================= COMPONENT ================= */

export function BannerModal({
  open,
  mode,
  banner,
  onClose,
  onSaved,
}: Props) {
  const { toast } = useToast();
  const isView = mode === 'view';

  const [products, setProducts] = React.useState<Product[]>([]);
  const [uploading, setUploading] = React.useState(false);

  const [form, setForm] = React.useState<BannerForm>({
    heading: '',
    subHeading: '',
    image: '',

    button1Text: 'Get a Quote',
    button1Link: '/contact',

    button2Text: 'Find More',
    productId: 'none',

    order: 1,
    status: 'active',
  });

  /* ================= FETCH PRODUCTS ================= */

  React.useEffect(() => {
    if (!open) return;

    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(() =>
        toast({
          variant: 'destructive',
          title: 'Failed to load products',
        })
      );
  }, [open, toast]);

  /* ================= POPULATE FORM ================= */

  React.useEffect(() => {
    if (!banner) return;

    setForm({
      heading: banner.heading,
      subHeading: banner.subHeading ?? '',
      image: banner.image,

      button1Text: banner.button1Text,
      button1Link: banner.button1Link,

      button2Text: banner.button2Text ?? 'Find More',
      productId: banner.productId ?? 'none',

      order: banner.order,
      status: banner.status,
    });
  }, [banner]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const payload = {
      ...form,
      productId:
        form.productId === 'none'
          ? undefined
          : form.productId,
      position: 'HOME', // 🔒 always home
    };

    const url =
      mode === 'edit'
        ? `/api/banners/${banner?.id}`
        : '/api/banners';

    const method = mode === 'edit' ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast({
        variant: 'destructive',
        title: 'Save failed',
      });
      return;
    }

    toast({ title: 'Banner saved' });
    onSaved();
    onClose();
  };

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={onClose}>
<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? 'Add Banner'
              : mode === 'edit'
              ? 'Edit Banner'
              : 'View Banner'}
          </DialogTitle>
        </DialogHeader>

        {form.image && (
          <Image
            src={form.image}
            alt="Banner"
            width={800}
            height={300}
            className="rounded mb-4 object-cover"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LEFT */}
          <div className="space-y-3">
            <div>
              <Label>Heading</Label>
              <Input
                disabled={isView}
                value={form.heading}
                onChange={(e) =>
                  setForm({ ...form, heading: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Sub Heading</Label>
              <Input
                disabled={isView}
                value={form.subHeading}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subHeading: e.target.value,
                  })
                }
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <Label>Banner Image</Label>
              <Input
                type="file"
                accept="image/*"
                disabled={isView || uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('folder', 'banners');

                  setUploading(true);

                  const res = await fetch(
                    '/api/upload/cloudinary',
                    {
                      method: 'POST',
                      body: formData,
                    }
                  );

                  const data = await res.json();

                  if (!res.ok || !data.url) {
                    toast({
                      variant: 'destructive',
                      title: 'Image upload failed',
                    });
                    setUploading(false);
                    return;
                  }

                  setForm((prev) => ({
                    ...prev,
                    image: data.url,
                  }));

                  setUploading(false);
                }}
              />

              {uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Uploading image…
                </p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <div>
              <Label>Button 1 Text</Label>
              <Input
                disabled={isView}
                value={form.button1Text}
                onChange={(e) =>
                  setForm({
                    ...form,
                    button1Text: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Button 1 Link</Label>
              <Input
                disabled={isView}
                value={form.button1Link}
                onChange={(e) =>
                  setForm({
                    ...form,
                    button1Link: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Button 2 Text</Label>
              <Input
                disabled={isView}
                value={form.button2Text}
                onChange={(e) =>
                  setForm({
                    ...form,
                    button2Text: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Button 2 Product</Label>
              <Select
                disabled={isView}
                value={form.productId}
                onValueChange={(v) =>
                  setForm({ ...form, productId: v })
                }
              >
                <SelectTrigger>
                  {form.productId === 'none'
                    ? '— Select Product —'
                    : products.find(
                        (p) => p.id === form.productId
                      )?.name}
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">
                    — Select Product —
                  </SelectItem>

                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Order</Label>
              <Input
                type="number"
                disabled={isView}
                value={form.order}
                onChange={(e) =>
                  setForm({
                    ...form,
                    order: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                disabled={isView}
                value={form.status}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    status: v as 'active' | 'inactive',
                  })
                }
              >
                <SelectTrigger>
                  {form.status}
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">
                    Active
                  </SelectItem>
                  <SelectItem value="inactive">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {!isView && (
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
