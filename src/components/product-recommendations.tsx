import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

interface ProductRecommendationsProps {
  products: Product[];
}

export function ProductRecommendations({
  products,
}: ProductRecommendationsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="container pb-16">
      <div className="mt-16">
        <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">
          You Might Also Like
        </h2>

        <div
          className="
            mt-8
            grid
            grid-cols-2            /* ✅ MOBILE: 2 in row */
            sm:grid-cols-2
            lg:grid-cols-4         /* ✅ DESKTOP: 4 in row */
            gap-6
          "
        >
          {products.slice(0, 4).map((product) => {
            const sellingPrice = product.sellingPrice;
            const discountedPrice =
              product.discountedPrice ?? sellingPrice;

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
                  {/* Product Name */}
                  <h3 className="text-sm font-semibold line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-1 flex items-center gap-2">
                    {sellingPrice &&
                      discountedPrice &&
                      discountedPrice < sellingPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{sellingPrice}
                        </span>
                      )}

                    <span className="text-sm font-bold text-gray-900">
                      ₹{discountedPrice}
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
