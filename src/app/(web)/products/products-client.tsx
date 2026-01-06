"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  categories: any[];
  products: any[];
  initialCategory: string | null;
};

/* ================= PRICE RANGES ================= */
const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "Under ₹1000", min: 0, max: 1000 },
  { label: "Under ₹2000", min: 0, max: 2000 },
  { label: "Under ₹5000", min: 0, max: 5000 },
  { label: "Above ₹5000", min: 5000, max: Infinity },
];

export default function ProductsClient({
  categories,
  products,
  initialCategory,
}: Props) {

  /* ================= STATE ================= */
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);


  /* ================= APPLY URL CATEGORY ================= */
  useEffect(() => {
    if (!initialCategory || !categories.length) return;

    const matchedCategory = categories.find(
      (cat) => cat.slug === initialCategory
    );

    if (matchedCategory) {
      setSelectedCategories([matchedCategory.name]);
    }
  }, [initialCategory, categories]);

  /* ================= HANDLERS ================= */

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const togglePrice = (label: string) => {
    setSelectedPrices((prev) =>
      prev.includes(label)
        ? prev.filter((p) => p !== label)
        : [...prev, label]
    );
  };

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category =
        product.categoryName || product.category;

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(category);

      const price =
        product.discountedPrice ?? product.sellingPrice ?? 0;

      const priceMatch =
        selectedPrices.length === 0 ||
        selectedPrices.some((label) => {
          const range = PRICE_RANGES.find(
            (r) => r.label === label
          );
          if (!range) return false;
          return price >= range.min && price <= range.max;
        });

      return (
        categoryMatch &&
        priceMatch &&
        product.status === "active"
      );
    });
  }, [products, selectedCategories, selectedPrices]);

  /* ================= UI ================= */

  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

        {/* ================= SIDEBAR ================= */}
       {/* ================= SIDEBAR / FILTERS ================= */}
<aside
  className={`
    fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white p-6
    transform transition-transform duration-300
    lg:static lg:translate-x-0 lg:w-auto lg:p-0
    ${showFilters ? "translate-x-0" : "-translate-x-full"}
  `}
>
  {/* Mobile Header */}
  <div className="flex items-center justify-between mb-6 lg:hidden">
    <h3 className="text-lg font-semibold">Filters</h3>
    <button
      onClick={() => setShowFilters(false)}
      className="text-xl font-bold"
    >
      ✕
    </button>
  </div>

  {/* Categories */}
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Categories</h3>

      <div className="space-y-3">
        {categories.map((cat) => (
          <label
            key={cat.slug}
            className="flex items-center gap-3 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.name)}
              onChange={() => toggleCategory(cat.name)}
              className="h-4 w-4"
            />
            <span>{cat.name}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Price</h3>

      <div className="space-y-3">
        {PRICE_RANGES.map((range) => (
          <label
            key={range.label}
            className="flex items-center gap-3 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedPrices.includes(range.label)}
              onChange={() => togglePrice(range.label)}
              className="h-4 w-4"
            />
            <span>{range.label}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Apply Button (Mobile) */}
    <button
      onClick={() => setShowFilters(false)}
      className="mt-6 w-full rounded-full bg-primary py-3 text-white lg:hidden"
    >
      Apply Filters
    </button>
  </div>
</aside>
{/* Overlay */}
{showFilters && (
  <div
    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
    onClick={() => setShowFilters(false)}
  />
)}

        {/* Mobile Filter Button */}
<div className="flex items-center justify-between mb-6 lg:hidden">
  <h1 className="text-xl font-semibold">All Products</h1>

  <button
    onClick={() => setShowFilters(true)}
    className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
  >
    Filters
  </button>
</div>

        {/* ================= PRODUCTS GRID ================= */}
        <div>
         <h1 className="hidden lg:block text-2xl font-semibold mb-8">
  All Products
</h1>

          {filteredProducts.length === 0 ? (
            <p className="text-muted-foreground">
              No products found.
            </p>
          ) : (
            // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">

              {filteredProducts.map((product, index) => (
                <div
                  key={`${product.slug}-${index}`}
                  className="group bg-white rounded-2xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative aspect-[4/5] bg-gray-50 rounded-t-xl overflow-hidden">
                      <Image
                        src={
                          product.primaryImage ||
                          product.images?.[0] ||
                          "/uploads/default-product.jpg"
                        }
                        alt={product.name}
                        fill
                        className="object-contain p-6 transition group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5 space-y-1">
                      <h3 className="text-base font-semibold">
                        {product.name}
                      </h3>

                      {product.categoryName && (
                        <p className="text-sm text-muted-foreground">
                          {product.categoryName}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
