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

  /* ================= HANDLE CLOSE ================= */

  const handleClose = () => {
    // Reset form to default state
    setForm({
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
    onClose();
  };

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={handleClose} >
<DialogContent className="max-w-sm md:max-w-2xl max-h-[90vh] overflow-y-auto w-[92vw] sm:w-full mx-auto p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            {mode === 'add'
              ? 'Add Banner'
              : mode === 'edit'
              ? 'Edit Banner'
              : 'View Banner'}
          </DialogTitle>

          {/* Banner Image Guideline */}
<div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs sm:text-sm text-primary">
  <span className="font-medium">Image guideline:</span>{" "}
  Please upload a banner image with recommended size{" "}
  <span className="font-semibold">1920 × 1080 px</span> (16:9)
  for best display across all screens.
</div>
        </DialogHeader>

        {form.image && (
          <Image
            src={form.image}
            alt="Banner"
            width={800}
            height={300}
            className="rounded mb-3 sm:mb-4 object-cover w-full h-auto"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* LEFT */}
          <div className="space-y-2 sm:space-y-3">
            <div>
              <Label className="text-sm sm:text-base">Heading</Label>
              <Input
                disabled={isView}
                className="text-sm h-9 sm:h-10"
                value={form.heading}
                onChange={(e) =>
                  setForm({ ...form, heading: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="text-sm sm:text-base">Sub Heading</Label>
              <Input
                disabled={isView}
                className="text-sm h-9 sm:h-10"
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
              <Label className="text-sm sm:text-base">Banner Image</Label>
              <Input
                type="file"
                accept="image/*"
                disabled={isView || uploading}
                className="text-sm h-9 sm:h-10"
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
          <div className="space-y-2 sm:space-y-3">
            <div>
              <Label className="text-sm sm:text-base">Button 1 Text</Label>
              <Input
                disabled={isView}
                className="text-sm h-9 sm:h-10"
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
              <Label className="text-sm sm:text-base">Button 1 Link</Label>
              <Input
                disabled={isView}
                className="text-sm h-9 sm:h-10"
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
              <Label className="text-sm sm:text-base">Button 2 Text</Label>
              <Input
                disabled={isView}
                className="text-sm h-9 sm:h-10"
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
              <Label className="text-sm sm:text-base">Button 2 Product</Label>
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
              <Label className="text-sm sm:text-base">Order</Label>
              <Input
                type="number"
                disabled={isView}
                className="text-sm h-9 sm:h-10"
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
              <Label className="text-sm sm:text-base">Status</Label>
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
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
            <Button variant="outline" onClick={handleClose} className="text-sm sm:text-base h-9 sm:h-10">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="text-sm sm:text-base h-9 sm:h-10">Save</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
