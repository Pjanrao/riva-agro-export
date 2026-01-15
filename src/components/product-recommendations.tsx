import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPriceUSD } from "@/lib/price";

interface ProductRecommendationsProps {
  products: Product[];
  usdRate?: number;
}

export function ProductRecommendations({
  products,
  usdRate = 1,
}: ProductRecommendationsProps) {

  // ✅ Filter active products first
  const activeProducts = products?.filter(
    (product) => product.status === "active"
  ) ?? [];

  // ❌ Hide section completely if no active products
  if (!activeProducts.length) {
    return null;
  }

  return (
    <section className="container pb-16">
      <div className="mt-16">

        {/* ✅ Title shows ONLY when products exist */}
        <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">
          You Might Also Like
        </h2>

        <div
          className="
            mt-8
            grid
            grid-cols-2
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {activeProducts.slice(0, 4).map((product) => {
            const selling = product.sellingPrice ?? 0;
            const discounted = product.discountedPrice ?? selling;

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="
                  group
                  bg-white
                  rounded-2xl
                  shadow-sm
                  transition-all
                  hover:shadow-lg
                  hover:-translate-y-1
                "
              >
                {/* Image */}
                <div className="relative aspect-[4/5] bg-gray-50 rounded-t-xl overflow-hidden">
                  <Image
                    src={
                      product.primaryImage ||
                      product.images?.[0] ||
                      "/uploads/default-product.jpg"
                    }
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2">
                    {discounted < selling && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPriceUSD(selling, usdRate)}
                      </span>
                    )}

                    <span className="text-sm font-bold text-gray-900">
                      {formatPriceUSD(discounted, usdRate)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
