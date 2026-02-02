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

  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),

  pin: z.string().min(1),
  address: z.string().min(1),

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
    form.reset({
      ...customer,
      latitude: customer.latitude ?? '',
      longitude: customer.longitude ?? '',
      referenceName: customer.referenceName ?? '',
      referenceContact: customer.referenceContact ?? '',
    });
  }

  if (mode === 'add') {
    form.reset();
  }
}, [open, mode, customer, form]);
  const onSubmit = async (values: FormValues) => {
  if (isView) return;

  // 🔥 REMOVE EMPTY FIELDS (important for edit)
  const payload = Object.fromEntries(
    Object.entries(values).filter(
      ([_, v]) => v !== '' && v !== undefined
    )
  );

  const res = await fetch(
    mode === 'edit'
      ? `/api/customers/${customer!.id}`
      : '/api/customers',
    {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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

  toast({ title: 'Customer updated successfully' });
  onSaved();
  onClose();
};
  return (
<Dialog
  open={open}
  onOpenChange={(isOpen) => {
    if (!isOpen) onClose();
  }}
>      <DialogContent className="w-[95vw] max-w-[480px] max-h-[80vh] overflow-y-auto">
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
              <Button variant="outline" onClick={onClose}>
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



// 'use client';

// import * as React from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Country, State, City } from 'country-state-city';
// import { Check, ChevronsUpDown } from 'lucide-react';

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//   Command,
//   CommandInput,
//   CommandItem,
//   CommandGroup,
//   CommandEmpty,
// } from '@/components/ui/command';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast';

// /* ================= TYPES ================= */

// export type Customer = {
//   id: string;
//   fullName: string;
//   contactNo: string;
//   email: string;
//   address: string;
//   country: string; // ISO code
//   state: string;   // ISO code
//   city: string;
//   pin: string;
//   latitude?: string;
//   longitude?: string;
//   referenceName?: string;
//   referenceContact?: string;
// };

// /* ================= SCHEMA ================= */

// const schema = z.object({
//   fullName: z.string().min(1),
//   email: z.string().email(),
//   contactNo: z.string().min(1),

//   country: z.string().min(1),
//   state: z.string().min(1),
//   city: z.string().min(1),
//   pin: z.string().min(1),

//   latitude: z.string().optional(),
//   longitude: z.string().optional(),

//   address: z.string().min(1),
//   referenceName: z.string().optional(),
//   referenceContact: z.string().optional(),
// });

// type FormValues = z.infer<typeof schema>;

// type Props = {
//   open: boolean;
//   mode: 'add' | 'edit' | 'view';
//   customer: Customer | null;
//   onClose: () => void;
//   onSaved: () => void;
// };

// /* ================= HELPERS ================= */

// const getCountryName = (code?: string) =>
//   Country.getCountryByCode(code || '')?.name || code || '-';

// const getStateName = (country?: string, state?: string) =>
//   State.getStateByCodeAndCountry(state || '', country || '')?.name ||
//   state ||
//   '-';

// function Info({ label, value }: { label: string; value?: string }) {
//   return (
//     <div>
//       <div className="text-xs text-muted-foreground">{label}</div>
//       <div className="font-medium">{value || '-'}</div>
//     </div>
//   );
// }

// function Divider() {
//   return <div className="border-t" />;
// }

// /* ================= COMPONENT ================= */

// export function CustomerModal({
//   open,
//   mode,
//   customer,
//   onClose,
//   onSaved,
// }: Props) {
//   const { toast } = useToast();
//   const isView = mode === 'view';

//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       fullName: '',
//       email: '',
//       contactNo: '',
//       country: '',
//       state: '',
//       city: '',
//       pin: '',
//       latitude: '',
//       longitude: '',
//       address: '',
//       referenceName: '',
//       referenceContact: '',
//     },
//   });

//   /* WATCH (important for dropdown UI) */
//   const countryCode = form.watch('country');
//   const stateCode = form.watch('state');
//   const cityValue = form.watch('city');

//   const countries = Country.getAllCountries();
//   const states = countryCode
//     ? State.getStatesOfCountry(countryCode)
//     : [];
//   const cities =
//     countryCode && stateCode
//       ? City.getCitiesOfState(countryCode, stateCode)
//       : [];

//   React.useEffect(() => {
//     if (!open) return;

//     if ((mode === 'edit' || mode === 'view') && customer) {
//       form.reset(customer);
//     }

//     if (mode === 'add') {
//       form.reset();
//     }
//   }, [open, mode, customer, form]);

// const onSubmit = async (values: FormValues) => {
//   if (isView) return;

//   const payload = {
//     ...values,
//     latitude: values.latitude || null,
//     longitude: values.longitude || null,
//   };

//   console.log('FINAL PAYLOAD 👉', payload);

//   const res = await fetch(
//     mode === 'edit'
//       ? `/api/customers/${customer?.id}`
//       : '/api/customers',
//     {
//       method: mode === 'edit' ? 'PUT' : 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     }
//   );
  
//     if (!res.ok) {
//       toast({ variant: 'destructive', title: 'Save failed' });
//       return;
//     }

//     toast({ title: 'Customer save successfully' });
//     onSaved();
    
//   // ✅ RESET ONLY FOR ADD MODE
//   if (mode === 'add') {
//     form.reset();
//   }
//     onClose();
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
// <DialogContent className="w-[95vw] max-w-[420px] sm:max-w-[480px] p-0 flex flex-col max-h-[80vh]">
//         <DialogHeader className="px-4 py-3 border-b">
//           <DialogTitle>
//             {mode === 'view'
//               ? 'Customer Details'
//               : mode === 'edit'
//               ? 'Edit Customer'
//               : 'Add Customer'}
//           </DialogTitle>
//         </DialogHeader>

// {/* -------------------- VIEW MODE ---------------- */}

// {isView && customer && (
//   <>
//     {/* BODY */}
//     <div className="flex-1  p-3 text-sm space-y-3">

//       <h3 className="text-base font-semibold leading-tight">
//         {customer.fullName}
//       </h3>

//       <Divider />

//       <div className="grid grid-cols-2 gap-3">
//         <Info label="Email" value={customer.email} />
//         <Info label="Contact No" value={customer.contactNo} />
//       </div>

//       <Divider />

//       <div className="grid grid-cols-2 gap-3">
//         <Info label="Country" value={getCountryName(customer.country)} />
//         <Info
//           label="State"
//           value={getStateName(customer.country, customer.state)}
//         />
//         <Info label="City" value={customer.city} />
//         <Info label="Pincode" value={customer.pin} />
//       </div>

//       {(customer.latitude || customer.longitude) && (
//         <>
//           <Divider />
//           <div className="grid grid-cols-2 gap-3">
//             {customer.latitude && (
//               <Info label="Latitude" value={customer.latitude} />
//             )}
//             {customer.longitude && (
//               <Info label="Longitude" value={customer.longitude} />
//             )}
//           </div>
//         </>
//       )}

//       <Divider />
//       <Info label="Address" value={customer.address} />

//       {(customer.referenceName || customer.referenceContact) && (
//         <>
//           <Divider />
//           <div className="grid grid-cols-2 gap-3">
//             {customer.referenceName && (
//               <Info label="Reference Name" value={customer.referenceName} />
//             )}
//             {customer.referenceContact && (
//               <Info
//                 label="Reference Contact"
//                 value={customer.referenceContact}
//               />
//             )}
//           </div>
//         </>
//       )}
//     </div>

//     {/* FOOTER (FIXED INSIDE MODAL) */}
//     <div className="border-t px-3 py-2 flex justify-end bg-white">
//       <Button variant="outline" size="sm" onClick={onClose}>
//         Close
//       </Button>
//     </div>
//   </>
// )}

//         {/* ================= ADD / EDIT ================= */}
//         {!isView && (
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="p-4 space-y-3 text-sm max-h-[70vh] overflow-y-auto"
//           >
//             <InputField label="Full Name" {...form.register('fullName')} />
//             <InputField label="Email" {...form.register('email')} />
//             <InputField label="Contact No" {...form.register('contactNo')} />

//             <SearchSelect
//               label="Country"
//               value={countryCode}
//               items={countries.map((c) => ({
//                 value: c.isoCode,
//                 label: c.name,
//               }))}
//               onSelect={(v) => {
//                 form.setValue('country', v, { shouldDirty: true });
//                 form.setValue('state', '');
//                 form.setValue('city', '');
//               }}
//             />

//             <SearchSelect
//               label="State"
//               value={stateCode}
//               disabled={!countryCode}
//               items={states.map((s) => ({
//                 value: s.isoCode,
//                 label: s.name,
//               }))}
//               onSelect={(v) => {
//                 form.setValue('state', v, { shouldDirty: true });
//                 form.setValue('city', '');
//               }}
//             />

//             <SearchSelect
//               label="City"
//               value={cityValue}
//               disabled={!stateCode}
//               items={cities.map((c) => ({
//                 value: c.name,
//                 label: c.name,
//               }))}
//               onSelect={(v) =>
//                 form.setValue('city', v, {
//                   shouldDirty: true,
//                   shouldTouch: true,
//                 })
//               }
//             />

//             <InputField label="Pincode" {...form.register('pin')} />

//             <div>
//               <Label className="mb-2 block">Location</Label>
//               <div className="grid grid-cols-2 gap-3">
//                 <Input placeholder="Latitude" {...form.register('latitude')} />
//                 <Input placeholder="Longitude" {...form.register('longitude')} />
//               </div>
//             </div>

//             <div>
//               <Label>Address</Label>
//               <Textarea rows={2} {...form.register('address')} />
//             </div>

//             <InputField label="Reference Name" {...form.register('referenceName')} />
//             <InputField
//               label="Reference Contact"
//               {...form.register('referenceContact')}
//             />

//             <div className="flex justify-end gap-2 pt-2">
//               <Button type="button" variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="submit">
//                 {mode === 'edit' ? 'Update' : 'Save'}
//               </Button>
//             </div>
//           </form>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

// /* ================= UI HELPERS ================= */

// function InputField({ label, ...props }: any) {
//   return (
//     <div>
//       <Label>{label}</Label>
//       <Input {...props} />
//     </div>
//   );
// }

// function SearchSelect({
//   label,
//   value,
//   items,
//   onSelect,
//   disabled,
// }: {
//   label: string;
//   value: string;
//   items: { label: string; value: string }[];
//   onSelect: (v: string) => void;
//   disabled?: boolean;
// }) {
//   const [open, setOpen] = React.useState(false);

//   const selectedLabel =
//     items.find((i) => i.value === value)?.label ?? '';

//   return (
//     <div>
//       <Label>{label}</Label>

//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             disabled={disabled}
//             className="w-full justify-between"
//           >
//             {selectedLabel || `Select ${label}`}
//             <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
//           </Button>
//         </PopoverTrigger>

//         <PopoverContent
//           className="w-[--radix-popover-trigger-width] p-0"
//           onPointerDown={(e) => e.stopPropagation()} // 🔥 IMPORTANT
//         >
//           <Command>
//             <CommandInput placeholder={`Search ${label}...`} />

//             <CommandEmpty>No results found.</CommandEmpty>

//             <ScrollArea className="h-[220px]">
//               <CommandGroup>
//                 {items.map((item) => (
//                   <CommandItem
//                     key={item.value}
//                     value={item.label} // 🔥 MUST BE LABEL
//                     onSelect={() => {
//                       onSelect(item.value); // send ISO code
//                       setOpen(false);
//                     }}
//                   >
//                     <Check
//                       className={cn(
//                         'mr-2 h-4 w-4',
//                         item.value === value
//                           ? 'opacity-100'
//                           : 'opacity-0'
//                       )}
//                     />
//                     {item.label}
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </ScrollArea>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }