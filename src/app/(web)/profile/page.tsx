"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ChangePasswordForm from "@/components/change-password-form";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);


  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    contactNo: "",
    country: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
    latitude: "",
    longitude: "",
    referenceName: "",
    referenceContact: "",
  });
  useEffect(() => {
  fetch("https://restcountries.com/v3.1/all?fields=name")
    .then(res => res.json())
    .then(data => {
      setCountries(
        data
          .map((c: any) => c.name.common)
          .sort()
      );
    });
}, []);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        contactNo: user.contactNo ?? "",
        country: user.country ?? "",
        state: user.state ?? "",
        city: user.city ?? "",
        address: user.address ?? "",
        pincode: user.pincode ?? "",
        latitude: user.latitude?.toString() ?? "",
        longitude: user.longitude?.toString() ?? "",
        referenceName: user.referenceName ?? "",
        referenceContact: user.referenceContact ?? "",
      });
    }
  }, [user]);

  // 🔁 Auto-load states when editing profile
useEffect(() => {
  if (formData.country) {
    handleCountryChange(formData.country);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [formData.country]);

// 🔁 Auto-load cities when editing profile
useEffect(() => {
  if (formData.state) {
    handleStateChange(formData.state);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [formData.state]);


  if (isLoading || !user) return null;

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const res = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
       credentials: "include",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setEditMode(false);
    }
  };

  const handleCountryChange = async (country: string) => {
  setFormData((p: any) => ({
    ...p,
    country,
    state: "",
    city: "",
  }));

  const res = await fetch(
    "https://countriesnow.space/api/v0.1/countries/states",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    }
  );

  const data = await res.json();
  setStates(data.data?.states?.map((s: any) => s.name) || []);
};
const handleStateChange = async (state: string) => {
  setFormData((p: any) => ({
    ...p,
    state,
    city: "",
  }));

  const res = await fetch(
    "https://countriesnow.space/api/v0.1/countries/state/cities",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: formData.country,
        state,
      }),
    }
  );

  const data = await res.json();
  setCities(data.data || []);
};


  return (
    <div className="container py-4">
       {/* ===== PAGE HEADER ===== */}
      <div className="max-w-5xl mx-auto mb-8 text-center sm:text-left">
        <h3 className="font-headline text-2xl font-bold mb-5">
          My Profile
        </h3>
       
        {/* 🔔 PROFILE INCOMPLETE ALERT */}
          {!user.profileCompleted && !editMode && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm">
              <p className="font-medium">Profile incomplete</p>
              <p className="text-muted-foreground">
Providing additional information helps us serve you better during orders and enquiries.              </p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => setEditMode(true)}
              >
                Complete Profile
              </Button>
            </div>
          )}
  </div>

      <Card className="max-w-5xl mx-auto">
      
<CardContent className="space-y-4">

        
          {/* ================= VIEW MODE ================= */}
          {!editMode && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-5">
              <ProfileRow label="Full Name" value={user.name} />
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Contact No" value={user.contactNo ?? "—"} />
              <ProfileRow label="Country" value={user.country ?? "—"} />
              <ProfileRow label="State" value={user.state ?? "—"} />
              <ProfileRow label="City" value={user.city ?? "—"} />
              <ProfileRow label="Address" value={user.address ?? "—"} />
              <ProfileRow label="Pincode" value={user.pincode ?? "—"} />
              <ProfileRow label="Latitude" value={user.latitude?.toString() ?? "—"} />
              <ProfileRow label="Longitude" value={user.longitude?.toString() ?? "—"} />
              <ProfileRow label="Reference Name" value={user.referenceName ?? "—"} />
              <ProfileRow label="Reference Contact" value={user.referenceContact ?? "—"} />

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowPassword(true)}
                >
                  Change Password
                </Button>
              </div>
            </div>
          )}

          {/* ================= EDIT MODE ================= */}
          {editMode && (
            <>
              <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} />
              <FormInput label="Email" name="email" value={formData.email} readOnly />
              <FormInput label="Contact No" name="contactNo" value={formData.contactNo} onChange={handleChange} />

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             
  {/* COUNTRY */}
  <div className="space-y-2">
    <Label>Country</Label>
    <Select
      value={formData.country}
      onValueChange={handleCountryChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* STATE */}
  <div className="space-y-2">
    <Label>State</Label>
    <Select
      value={formData.state}
      onValueChange={handleStateChange}
      disabled={!states.length}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select state" />
      </SelectTrigger>
      <SelectContent>
        {states.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* CITY */}
  <div className="space-y-2">
    <Label>City</Label>
    <Select
      value={formData.city}
      onValueChange={(city) =>
        setFormData((p: any) => ({ ...p, city }))
      }
      disabled={!cities.length}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select city" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>



                <FormInput label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
                <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} />

              </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} />
                <FormInput label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} />
              </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Reference Name"
                  name="referenceName"
                  value={formData.referenceName}
                  onChange={handleChange}
                />
                <FormInput
                  label="Reference Contact"
                  name="referenceContact"
                  value={formData.referenceContact}
                  onChange={handleChange}
                />
              </div>

<div className="flex justify-end gap-3 pt-6">
                <Button onClick={handleSave}>Save Profile</Button>
                <Button variant="ghost" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 🔐 CHANGE PASSWORD MODAL */}
      <Dialog open={showPassword} onOpenChange={setShowPassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <ChangePasswordForm
            onSuccess={() => setShowPassword(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function FormInput(props: any) {
  const { label, value, ...inputProps } = props;
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value ?? ""} {...inputProps} />
    </div>
  );
}
