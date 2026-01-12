"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LogOut,
  Package,
  PanelLeft,
  ShoppingBag,
  Users,
  LayoutGrid,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Logo } from "@/components/icons/logo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false); // ✅ mobile sidebar control

  useEffect(() => setMounted(true), []);

  /* ✅ AUTO-CLOSE SIDEBAR ON ROUTE CHANGE */
  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  if (
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname.startsWith("/admin/reset-password")
  ) {
    return <>{children}</>;
  }

  /* ================= LOGOUT ================= */
  const confirmLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Logout successful");
      router.replace("/admin/login");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
      setLogoutOpen(false);
    }
  };

  /* ================= NAV ITEMS ================= */
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
     { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/product-management/import-product", label: "Product Management", icon: Package },
    { href: "/admin/customer-management", label: "Customers Management", icon: Users },
    { href: "/admin/order-management", label: "Order Management", icon: ShoppingBag },
    { href: "/admin/banner-management", label: "Banner Management", icon: LayoutGrid },
  ];

  /* ✅ ACTIVE PARENT HIGHLIGHT */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navLinks = (
    <nav className="grid items-start gap-2 px-4 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={() => setSheetOpen(false)} // ✅ close on click
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            isActive(item.href)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* ================= LOGOUT DIALOG ================= */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} disabled={loading}>
              {loading ? "Logging out..." : "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ================= LAYOUT ================= */}
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        {/* ===== DESKTOP SIDEBAR ===== */}
        <aside className="hidden lg:flex lg:flex-col h-screen border-r bg-muted/40">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin/dashboard">
              <Logo />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-2">{navLinks}</div>

          <div className="p-4 border-t">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setLogoutOpen(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* ===== MAIN ===== */}
        <div className="flex flex-col">
          <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-6">
            {/* ===== MOBILE SIDEBAR ===== */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <PanelLeft className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="
                  flex h-screen flex-col p-0
                  w-1/2 max-w-[70vw]
                  shadow-xl
                "
              >
                <SheetHeader className="h-16 flex-row items-center border-b px-6">
                  <SheetTitle>
                    <Link href="/admin/dashboard">
                      <Logo />
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-2">
                  {navLinks}
                </div>

                <div className="p-4 border-t">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => setLogoutOpen(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-lg font-semibold capitalize">
                {pathname.split("/").pop()?.replace("-", " ")}
              </h1>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setLogoutOpen(true)}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}