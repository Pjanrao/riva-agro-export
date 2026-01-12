"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EnquiryModal from "@/components/enquiry-modals";
import { formatPriceUSD } from "@/lib/price";

type EnquiryProduct = {
  id: string;
  name: string;
  category?: string;
};

type FeaturedProductProps = {
  products: any[];
  usdRate: number; // ✅ REQUIRED
};

export default function FeaturedProduct({
  products,
  usdRate,
}: FeaturedProductProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<EnquiryProduct | null>(null);

  const featuredProducts = products
    .filter((p) => p.featured && p.status === "active")
    .slice(0, 8);

  return (
    <>
      {/* ================= Featured Products ================= */}
      <section className="py-12 bg-secondary">
        <div className="container">
          <h2 className="text-center font-headline text-4xl font-bold">
            Featured Products
          </h2>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const isSandalPure =
                product.categoryName?.toLowerCase() === "sandal pure";

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition p-4 flex flex-col h-full">

                    {/* Image */}
                    <Image
                      src={
                        product.primaryImage ||
                        "/uploads/default-product.jpg"
                      }
                      alt={product.name}
                      width={400}
                      height={400}
                      className="object-contain"
                    />

                    {/* Product Name */}
                    <h3 className="mt-3 font-semibold line-clamp-2 text-gray-900">
                      {product.name}
                    </h3>

                    {/* Category */}
                    {product.categoryName && (
                      <p className="text-sm text-gray-500">
                        {product.categoryName}
                      </p>
                    )}

                    {/* PRICE / ENQUIRY / MOQ */}
                    <div className="mt-3">
                      {isSandalPure ? (
                        /* ✅ USD PRICE ONLY FOR SANDAL PURE */
                        <div className="text-lg font-bold text-gray-900">
                          {formatPriceUSD(
                            product.discountedPrice ??
                              product.sellingPrice,
                            usdRate
                          )}
                        </div>
                      ) : (
                        /* ✅ ENQUIRY FOR OTHERS */
                       <Button
  size="sm"
  variant="ghost"
  className="
    mt-2
    bg-gray-50
    text-gray-800
    border border-gray-200
    hover:bg-gray-100
    hover:text-gray-900
    transition
  "
  onClick={(e) => {
    e.preventDefault();
    setSelectedProduct({
      id: product.id,
      name: product.name,
      category: product.categoryName,
    });
    setEnquiryOpen(true);
  }}
>
  Send Enquiry
</Button>
                      )}

                      {/* ✅ MOQ FOR ALL PRODUCTS */}
                      {/* {product.minOrderQty && (
                        <span className="block mt-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 w-fit">
                          MOQ:{" "}
                          <span className="font-medium">
                            {product.minOrderQty}
                          </span>
                        </span>
                      )} */}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ✅ SINGLE MODAL INSTANCE */}
      {selectedProduct && (
        <EnquiryModal
          open={enquiryOpen}
          onOpenChange={setEnquiryOpen}
          product={selectedProduct}
        />
      )}
    </>
  );
}
