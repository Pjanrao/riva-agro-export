import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AuthProvider from "@/components/auth-provider";
import FloatingActions from "@/components/FloatingActions";



export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <AuthProvider>
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}      
     <FloatingActions /> {/* ✅ FRONTEND ONLY */}
     </main>
      <Footer />
    </div>
    </AuthProvider>
    
  );
}
