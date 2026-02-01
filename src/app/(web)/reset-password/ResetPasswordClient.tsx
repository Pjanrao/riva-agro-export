"use client";

import { useSearchParams } from "next/navigation";
import ResetPasswordClient from "@/components/reset-password-client";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-xl font-semibold">
          Invalid or expired reset link
        </h2>
      </div>
    );
  }

  return (
    <div className="container py-20 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Reset Password
      </h1>

      {/* ✅ Form component */}
      <ResetPasswordClient token={token} />
    </div>
  );
}
