'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

/* ================= TYPES ================= */

export type Customer = {
  id: string;
  fullName: string;
  contactNo: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pin: string;
  referenceName?: string;
  referenceContact?: string;
};

/* ================= SCHEMA ================= */

const schema = z.object({
  fullName: z.string().min(1),
  contactNo: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  pin: z.string().min(1),
  referenceName: z.string().optional(),
  referenceContact: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: 'add' | 'edit' | 'view';
  customer: Customer | null;
  onClose: () => void;
  onSaved: () => void;
};

/* ================= COMPONENT ================= */

export function CustomerModal({
  open,
  mode,
  customer,
  onClose,
  onSaved,
}: Props) {
  const { toast } = useToast();
  const isView = mode === 'view';

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      contactNo: '',
      email: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pin: '',
      referenceName: '',
      referenceContact: '',
    },
  });

  /* ================= RESET ================= */

  const resetForm = () => {
    form.reset();
  };

  /* ================= PREFILL ================= */

  React.useEffect(() => {
    if (!open) return;

    if ((mode === 'edit' || mode === 'view') && customer) {
      form.reset(customer);
    }

    if (mode === 'add') {
      resetForm();
    }
  }, [open, mode, customer, form]);

  /* ================= SUBMIT ================= */

  const onSubmit = async (values: FormValues) => {
    if (isView) return;

    const res = await fetch(
      mode === 'edit'
        ? `/api/customers/${customer?.id}`
        : '/api/customers',
      {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }
    );

    if (!res.ok) {
      toast({ variant: 'destructive', title: 'Save failed' });
      return;
    }

    toast({ title: 'Customer saved' });
    onSaved();
    resetForm();
    onClose();
  };

  /* ================= UI ================= */

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle>
            {mode === 'view'
              ? 'Customer Details'
              : mode === 'edit'
              ? 'Edit Customer'
              : 'Add Customer'}
          </DialogTitle>
        </DialogHeader>

        {/* VIEW MODE */}
        {isView && customer && (
          <div className="p-5 text-sm space-y-3">
            <Info label="Full Name" value={customer.fullName} />
            <Info label="Contact No" value={customer.contactNo} />
            <Info label="Email" value={customer.email} />
            <Info label="Address" value={customer.address} />
            <Info label="Location" value={`${customer.city}, ${customer.state}, ${customer.country} - ${customer.pin}`} />
            <Info label="Reference" value={`${customer.referenceName || '-'} (${customer.referenceContact || '-'})`} />

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}

        {/* ADD / EDIT FORM */}
        {!isView && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-5 grid grid-cols-2 gap-4 text-sm max-h-[75vh] overflow-y-auto"
          >
            {[
              ['Full Name', 'fullName'],
              ['Contact No', 'contactNo'],
              ['Email', 'email'],
              ['Country', 'country'],
              ['State', 'state'],
              ['City', 'city'],
              ['Pin Code', 'pin'],
              ['Reference Name', 'referenceName'],
              ['Reference Contact', 'referenceContact'],
            ].map(([label, key]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input {...form.register(key as any)} />
              </div>
            ))}

            <div className="col-span-2">
              <Label>Address</Label>
              <Textarea rows={2} {...form.register('address')} />
            </div>

            <div className="col-span-2 flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'edit' ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ================= HELPER ================= */

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value || '-'}</div>
    </div>
  );
}
