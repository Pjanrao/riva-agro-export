"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { getUsdRate } from "@/lib/getUsdRate";
import { formatPriceUSD } from "@/lib/price";


export function CartSheet() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  // ✅ USD rate (client-side)
  const [usdRate, setUsdRate] = useState<number>(1);

  useEffect(() => {
    async function fetchRate() {
      try {
        const rate = await getUsdRate();
        setUsdRate(rate || 1);
      } catch {
        setUsdRate(1);
      }
    }
    fetchRate();
  }, []);

  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
       {mounted && cartCount > 0 && (
  <Badge
    variant="destructive"
    className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
  >
    {cartCount}
  </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
<SheetTitle>
  Cart {mounted ? `(${cartCount})` : ""}
</SheetTitle>        </SheetHeader>

        <Separator />

{mounted && cartCount > 0 ? (          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 p-6 pr-8">
                {cartItems.map((item, index) => {
                  const itemTotal = item.price * item.quantity;

                  return (
                    <div
                     key={item.productId}
                      className="flex items-start gap-4"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-md">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                       

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                           <Button
  variant="outline"
  size="icon"
  className="h-6 w-6"
  onClick={() =>
    updateQuantity(item.productId, item.quantity - 1)
  }
>
  <Minus className="h-3 w-3" />
</Button>
                            <span>{item.quantity}</span>
                         <Button
  variant="outline"
  size="icon"
  className="h-6 w-6"
  onClick={() =>
    updateQuantity(item.productId, item.quantity + 1)
  }
>
  <Plus className="h-3 w-3" />
</Button>
                          </div>

                          {/* USD ROW TOTAL */}
                          <p className="font-semibold">
                            {formatPriceUSD(itemTotal, usdRate)}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <Separator />

            {/* USD TOTAL */}
            <SheetFooter className="p-6 sm:justify-between">
              <div className="text-lg font-semibold">
                <span>Total:</span>{" "}
                <span>{formatPriceUSD(cartTotal, usdRate)}</span>
              </div>

              <SheetClose asChild>
                <Button asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">
              Add some products to get started.
            </p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
