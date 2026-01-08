import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AuthProvider from "@/components/auth-provider";


export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <AuthProvider>
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
    </AuthProvider>
  );
}
