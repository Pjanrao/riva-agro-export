import ChangePasswordForm from "@/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <div className="container py-20 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="font-headline text-2xl mb-6">
          Change Password
        </h1>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
