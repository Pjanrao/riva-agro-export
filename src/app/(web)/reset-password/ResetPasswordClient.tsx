"use client";

import { useSearchParams } from "next/navigation";
import ChangePasswordForm from "@/components/change-password-form";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-xl font-semibold">Invalid or expired link</h2>
      </div>
    );
  }

  return (
    <div className="container py-20 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

      {/* 🔥 Reuse your existing form */}
      <ChangePasswordForm />
    </div>
  );
}
