"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import type { User } from "@/lib/types";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [editMode, setEditMode] = useState(false);
 const [formData, setFormData] = useState<any>({
  name: "",
  email: "",
  contactNo: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  latitude: "",
  longitude: "",
  referenceName: "",
  referenceContact: "",
});


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
      pincode: user.pincode ?? "",
      latitude: user.latitude?.toString() ?? "",
      longitude: user.longitude?.toString() ?? "",
      referenceName: user.referenceName ?? "",
      referenceContact: user.referenceContact ?? "",
    });
  }
}, [user]);


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
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user); // ✅ update Zustand
      setEditMode(false);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="font-headline text-4xl font-bold mb-8">
        My Profile
      </h1>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Profile Information
          </CardTitle>
          <CardDescription>
            View and manage your personal details.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* 🔔 PROFILE INCOMPLETE ALERT */}
          {!user.profileCompleted && !editMode && (
            <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm">
              <p className="font-medium">Profile incomplete</p>
              <p className="text-muted-foreground">
                Complete your profile to place orders and request export quotes.
              </p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => setEditMode(true)}
              >
                Complete Profile
              </Button>
            </div>
          )}

          {/* ================= VIEW MODE ================= */}
          {!editMode && (
            <>
              <ProfileRow label="Name" value={user.name} />
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Contact No" value={user.contactNo ?? "—"} />
              <ProfileRow label="Country" value={user.country ?? "—"} />
              <ProfileRow label="State" value={user.state ?? "—"} />
              <ProfileRow label="City" value={user.city ?? "—"} />
              <ProfileRow label="Pincode" value={user.pincode ?? "—"} />
              <ProfileRow label="Latitude" value={user.latitude?.toString() ?? "—"} />
              <ProfileRow label="Longitude" value={user.longitude?.toString() ?? "—"} />
              <ProfileRow label="Reference Name" value={user.referenceName ?? "—"} />
              <ProfileRow label="Reference Contact" value={user.referenceContact ?? "—"} />

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            </>
          )}

          {/* ================= EDIT MODE ================= */}
          {editMode && (
            <>
              <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} />
              <FormInput label="Email" name="email" value={formData.email} readOnly />
              <FormInput label="Contact No" name="contactNo" value={formData.contactNo} onChange={handleChange} />

              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Country" name="country" value={formData.country} onChange={handleChange} />
                <FormInput label="State" name="state" value={formData.state} onChange={handleChange} />
                <FormInput label="City" name="city" value={formData.city} onChange={handleChange} />
                <FormInput label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} />
                <FormInput label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave}>Save Profile</Button>
                <Button variant="ghost" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- SMALL HELPERS ---------------- */

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

