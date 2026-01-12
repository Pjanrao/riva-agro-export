'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Country, State, City } from 'country-state-city';
import { Check, ChevronsUpDown } from 'lucide-react';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

/* ================= TYPES ================= */

export type Customer = {
  id: string;
  fullName: string;
  contactNo: string;
  email: string;
  address: string;
  country: string; // ISO code
  state: string;   // ISO code
  city: string;
  pin: string;
  latitude?: string;
  longitude?: string;
  referenceName?: string;
  referenceContact?: string;
};

/* ================= SCHEMA ================= */

const schema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  contactNo: z.string().min(1),

  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  pin: z.string().min(1),

  latitude: z.string().optional(),
  longitude: z.string().optional(),

  address: z.string().min(1),
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
  Country.getCountryByCode(code || '')?.name || code || '-';

const getStateName = (country?: string, state?: string) =>
  State.getStateByCodeAndCountry(state || '', country || '')?.name ||
  state ||
  '-';

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value || '-'}</div>
    </div>
  );
}

function Divider() {
  return <div className="border-t" />;
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
    defaultValues: {
      fullName: '',
      email: '',
      contactNo: '',
      country: '',
      state: '',
      city: '',
      pin: '',
      latitude: '',
      longitude: '',
      address: '',
      referenceName: '',
      referenceContact: '',
    },
  });

  /* WATCH (important for dropdown UI) */
  const countryCode = form.watch('country');
  const stateCode = form.watch('state');
  const cityValue = form.watch('city');

  const countries = Country.getAllCountries();
  const states = countryCode
    ? State.getStatesOfCountry(countryCode)
    : [];
  const cities =
    countryCode && stateCode
      ? City.getCitiesOfState(countryCode, stateCode)
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

  const payload = {
    ...values,
    latitude: values.latitude || null,
    longitude: values.longitude || null,
  };

  console.log('FINAL PAYLOAD 👉', payload);

  const res = await fetch(
    mode === 'edit'
      ? `/api/customers/${customer?.id}`
      : '/api/customers',
    {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  
    if (!res.ok) {
      toast({ variant: 'destructive', title: 'Save failed' });
      return;
    }

    toast({ title: 'Customer save successfully' });
    onSaved();
    
  // ✅ RESET ONLY FOR ADD MODE
  if (mode === 'add') {
    form.reset();
  }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
<DialogContent className="w-[95vw] max-w-[420px] sm:max-w-[480px] p-0 flex flex-col max-h-[80vh]">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle>
            {mode === 'view'
              ? 'Customer Details'
              : mode === 'edit'
              ? 'Edit Customer'
              : 'Add Customer'}
          </DialogTitle>
        </DialogHeader>

{/* -------------------- VIEW MODE ---------------- */}

{isView && customer && (
  <>
    {/* BODY */}
    <div className="flex-1  p-3 text-sm space-y-3">

      <h3 className="text-base font-semibold leading-tight">
        {customer.fullName}
      </h3>

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
            {customer.latitude && (
              <Info label="Latitude" value={customer.latitude} />
            )}
            {customer.longitude && (
              <Info label="Longitude" value={customer.longitude} />
            )}
          </div>
        </>
      )}

      <Divider />
      <Info label="Address" value={customer.address} />

      {(customer.referenceName || customer.referenceContact) && (
        <>
          <Divider />
          <div className="grid grid-cols-2 gap-3">
            {customer.referenceName && (
              <Info label="Reference Name" value={customer.referenceName} />
            )}
            {customer.referenceContact && (
              <Info
                label="Reference Contact"
                value={customer.referenceContact}
              />
            )}
          </div>
        </>
      )}
    </div>

    {/* FOOTER (FIXED INSIDE MODAL) */}
    <div className="border-t px-3 py-2 flex justify-end bg-white">
      <Button variant="outline" size="sm" onClick={onClose}>
        Close
      </Button>
    </div>
  </>
)}

        {/* ================= ADD / EDIT ================= */}
        {!isView && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-3 text-sm max-h-[70vh] overflow-y-auto"
          >
            <InputField label="Full Name" {...form.register('fullName')} />
            <InputField label="Email" {...form.register('email')} />
            <InputField label="Contact No" {...form.register('contactNo')} />

            <SearchSelect
              label="Country"
              value={countryCode}
              items={countries.map((c) => ({
                value: c.isoCode,
                label: c.name,
              }))}
              onSelect={(v) => {
                form.setValue('country', v, { shouldDirty: true });
                form.setValue('state', '');
                form.setValue('city', '');
              }}
            />

            <SearchSelect
              label="State"
              value={stateCode}
              disabled={!countryCode}
              items={states.map((s) => ({
                value: s.isoCode,
                label: s.name,
              }))}
              onSelect={(v) => {
                form.setValue('state', v, { shouldDirty: true });
                form.setValue('city', '');
              }}
            />

            <SearchSelect
              label="City"
              value={cityValue}
              disabled={!stateCode}
              items={cities.map((c) => ({
                value: c.name,
                label: c.name,
              }))}
              onSelect={(v) =>
                form.setValue('city', v, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />

            <InputField label="Pincode" {...form.register('pin')} />

            <div>
              <Label className="mb-2 block">Location</Label>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Latitude" {...form.register('latitude')} />
                <Input placeholder="Longitude" {...form.register('longitude')} />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Textarea rows={2} {...form.register('address')} />
            </div>

            <InputField label="Reference Name" {...form.register('referenceName')} />
            <InputField
              label="Reference Contact"
              {...form.register('referenceContact')}
            />

            <div className="flex justify-end gap-2 pt-2">
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

/* ================= UI HELPERS ================= */

function InputField({ label, ...props }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
}

function SearchSelect({
  label,
  value,
  items,
  onSelect,
  disabled,
}: {
  label: string;
  value: string;
  items: { label: string; value: string }[];
  onSelect: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className="w-full justify-between"
          >
            {items.find((i) => i.value === value)?.label ||
              `Select ${label}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <CommandEmpty>No results found.</CommandEmpty>
            <ScrollArea className="h-[220px]">
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === item.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}