'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Country, State, City } from 'country-state-city';
import { ChevronDown, Check } from 'lucide-react';

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
import { cn } from '@/lib/utils';
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
  latitude?: string;
  longitude?: string;
  referenceName?: string;
  referenceContact?: string;
};

/* ================= SCHEMA ================= */

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  contactNo: z.string().min(10, 'Contact number must be at least 10 digits'),

  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),

  pin: z.string().min(1, 'Pincode is required'),
  address: z.string().min(1, 'Address is required'),

  latitude: z.string().optional(),
  longitude: z.string().optional(),

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

/* ================= HELPERS ================= */

const getCountryName = (code?: string) =>
  Country.getCountryByCode(code || '')?.name || '-';

const getStateName = (country?: string, state?: string) =>
  State.getStateByCodeAndCountry(state || '', country || '')?.name || '-';

function Divider() {
  return <div className="border-t" />;
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value || '-'}</div>
    </div>
  );
}

/* ================= CUSTOM SEARCH SELECT ================= */

function SearchSelect({
  label,
  value,
  items,
  placeholder,
  onSelect,
  disabled,
}: {
  label: string;
  value: string;
  placeholder: string;
  items: { label: string; value: string }[];
  onSelect: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const selectedLabel =
    items.find((i) => i.value === value)?.label ?? '';

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <Label>{label}</Label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex justify-between items-center rounded-md border px-3 py-2 text-sm',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {selectedLabel || placeholder}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
          <Input
            autoFocus
            placeholder={`Search ${label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="m-2 w-[calc(100%-16px)]"
          />

          <div className="max-h-[220px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No results
              </div>
            )}

            {filtered.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onSelect(item.value);
                  setOpen(false);
                  setSearch('');
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between"
              >
                {item.label}
                {item.value === value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
  });

  const handleClose = () => {
  form.reset();     // ✅ clear form data
  onClose();        // close modal
};

  const countryCode = form.watch('country');
  const stateCode = form.watch('state');
  const cityValue = form.watch('city');

  const countries = Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
  }));

  const states = countryCode
    ? State.getStatesOfCountry(countryCode).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }))
    : [];

  const cities =
    countryCode && stateCode
      ? City.getCitiesOfState(countryCode, stateCode).map((c) => ({
          label: c.name,
          value: c.name,
        }))
      : [];

  React.useEffect(() => {
    if (!open) return;

    if ((mode === 'edit' || mode === 'view') && customer) {
      form.reset(customer);
    }

    if (mode === 'add') {
      form.reset();
    }
  }, [open, mode, customer, form]);

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

    const data = await res.json();

    if (!res.ok) {
      toast({
        variant: 'destructive',
        title: data?.message || 'Save failed',
      });
      return;
    }

    toast({ title: 'Customer saved successfully' });
    onSaved();
    form.reset();   // ✅ clear form after success

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[480px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view'
              ? 'Customer Details'
              : mode === 'edit'
              ? 'Edit Customer'
              : 'Add Customer'}
          </DialogTitle>
        </DialogHeader>

        {/* ================= VIEW MODE ================= */}
        {isView && customer && (
          <>
            <div className="space-y-3 text-sm">
              <h3 className="text-base font-semibold">{customer.fullName}</h3>

              <Divider />

              <div className="grid grid-cols-2 gap-3">
                <Info label="Email" value={customer.email} />
                <Info label="Contact No" value={customer.contactNo} />
              </div>

              <Divider />

              <div className="grid grid-cols-2 gap-3">
                <Info label="Country" value={getCountryName(customer.country)} />
                <Info
                  label="State"
                  value={getStateName(customer.country, customer.state)}
                />
                <Info label="City" value={customer.city} />
                <Info label="Pincode" value={customer.pin} />
              </div>

              {(customer.latitude || customer.longitude) && (
                <>
                  <Divider />
                  <div className="grid grid-cols-2 gap-3">
                    <Info label="Latitude" value={customer.latitude} />
                    <Info label="Longitude" value={customer.longitude} />
                  </div>
                </>
              )}

              <Divider />
              <Info label="Address" value={customer.address} />
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </>
        )}

        {/* ================= ADD / EDIT ================= */}
        {!isView && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <InputField
              label="Full Name"
              error={form.formState.errors.fullName?.message}
              {...form.register('fullName')}
            />

            <InputField
              label="Email"
              error={form.formState.errors.email?.message}
              {...form.register('email')}
            />

            <InputField
              label="Contact No"
              error={form.formState.errors.contactNo?.message}
              {...form.register('contactNo')}
            />

            <SearchSelect
              label="Country"
              placeholder="Select Country"
              value={countryCode}
              items={countries}
              onSelect={(v) => {
                form.setValue('country', v);
                form.setValue('state', '');
                form.setValue('city', '');
              }}
            />
            {form.formState.errors.country && (
              <p className="text-xs text-red-500">
                {form.formState.errors.country.message}
              </p>
            )}

            <SearchSelect
              label="State"
              placeholder="Select State"
              value={stateCode}
              items={states}
              disabled={!countryCode}
              onSelect={(v) => {
                form.setValue('state', v);
                form.setValue('city', '');
              }}
            />
            {form.formState.errors.state && (
              <p className="text-xs text-red-500">
                {form.formState.errors.state.message}
              </p>
            )}

            <SearchSelect
              label="City"
              placeholder="Select City"
              value={cityValue}
              items={cities}
              disabled={!stateCode}
              onSelect={(v) => form.setValue('city', v)}
            />
            {form.formState.errors.city && (
              <p className="text-xs text-red-500">
                {form.formState.errors.city.message}
              </p>
            )}

            <InputField
              label="Pincode"
              error={form.formState.errors.pin?.message}
              {...form.register('pin')}
            />

            <div>
              <Label>Location</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input {...form.register('latitude')} placeholder="Latitude" />
                <Input {...form.register('longitude')} placeholder="Longitude" />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Textarea {...form.register('address')} />
              {form.formState.errors.address && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
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

/* ================= UI HELPERS ================= */

function InputField({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
  [key: string]: any;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        {...props}
        className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}