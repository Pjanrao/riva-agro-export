"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔒 default fallback values (DO NOT REMOVE)
  const [profile, setProfile] = useState({
    email: "admin@rivaagro.com",
    role: "admin",
  });

  // change password modal
  const [passwordOpen, setPasswordOpen] = useState(false);

  // change password form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/admin/profile", {
          credentials: "include",
        });

        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setProfile({
            email: data.email || profile.email,
            role: data.role || "admin",
          });
        }
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ================= UPDATE PASSWORD ================= */
  const updatePassword = async () => {
    setError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // 🔥 hard redirect to login (manual login required)
      window.location.href = "/admin/login";
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-sm">
        Loading profile...
      </div>
    );

  return (
    /* PAGE WRAPPER (mobile-safe, desktop unchanged) */
    <div className="flex justify-center px-4 sm:px-0">
      <div className="w-full max-w-xl space-y-6">
        <h2 className="text-2xl font-semibold">Admin Profile</h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* ================= PROFILE VIEW (READ ONLY) ================= */}
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={profile.email} disabled readOnly />
          </div>

          <div>
            <Label>Role</Label>
            <Input value={profile.role} disabled readOnly />
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div>
          <Button
            onClick={() => setPasswordOpen(true)}
            className="w-full sm:w-auto"
          >
            Change Password
          </Button>
        </div>

        {/* ================= CHANGE PASSWORD MODAL ================= */}
  <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
  <DialogContent
    className="
      w-[92%]
      max-w-sm
      sm:max-w-lg
      mx-auto
      h-[85vh]
      flex
      flex-col
      p-0
    "
  >
    {/* HEADER */}
    <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
      <DialogTitle>Change Password</DialogTitle>
      <DialogDescription>
        Update your admin account password securely.
      </DialogDescription>
    </DialogHeader>

    {/* BODY */}
    <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4">
      <div>
        <Label>Old Password</Label>
        <Input
          type="password"
          onChange={(e) =>
            setPasswordForm({
              ...passwordForm,
              oldPassword: e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label>New Password</Label>
        <Input
          type="password"
          onChange={(e) =>
            setPasswordForm({
              ...passwordForm,
              newPassword: e.target.value,
            })
          }
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Password must be at least 8 characters long and include one uppercase
        letter, one number, and one special character.
      </p>

      <div>
        <Label>Confirm Password</Label>
        <Input
          type="password"
          onChange={(e) =>
            setPasswordForm({
              ...passwordForm,
              confirmPassword: e.target.value,
            })
          }
        />
      </div>
    </div>

    {/* FOOTER */}
    <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
      <Button variant="outline" onClick={() => setPasswordOpen(false)}>
        Cancel
      </Button>
      <Button onClick={updatePassword} disabled={saving}>
        {saving ? "Updating..." : "Update Password"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>




      </div>
    </div>
  );
}