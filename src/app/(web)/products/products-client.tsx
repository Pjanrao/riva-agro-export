"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
//import { formatPriceUSD } from '@/lib/price';
import EnquiryModal from "@/components/enquiry-modals";

type Props = {
  categories: any[];
  products: any[];
  initialCategory: string | null;
   usdRate: number;
};

export default function ProductsClient({
  categories,
  products,
  initialCategory,
  usdRate
}: Props) {
  /* ================= STATE ================= */
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
  id: string;
  name: string;
  category?: string;
} | null>(null);

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

 

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category =
        product.categoryName || product.category;

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(category);

      return (
        categoryMatch &&
      //  priceMatch &&
        product.status === "active"
      );
    });
  }, [products, selectedCategories]);

  /* ================= UI ================= */
  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

  <aside
  className={`
    fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white p-6
    transform transition-transform duration-300
    lg:static lg:z-auto lg:w-auto lg:p-0
    ${showFilters ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
>
  {/* 👇 STICKY WRAPPER */}
 <div className="
    lg:sticky
    lg:top-16
    lg:max-h-[calc(100vh-4rem)]
    lg:overflow-y-auto
    lg:pr-6
  ">
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

          <div className="space-y-8">
            {/* Categories */}
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


            {/* Apply Button */}
            <button
              onClick={() => setShowFilters(false)}
              className="mt-6 w-full rounded-full bg-primary py-3 text-white lg:hidden"
            >
              Apply Filters
            </button>
          </div> </div>
        </aside>

        {/* Overlay */}
        {showFilters && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* ================= PRODUCTS ================= */}
        <div>
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h1 className="text-xl font-semibold">All Products</h1>
            <button
              onClick={() => setShowFilters(true)}
              className="rounded-full border px-4 py-2 text-sm"
            >
              Filters
            </button>
          </div>

          {/* Desktop Heading */}
          <h1 className="hidden lg:block text-2xl font-semibold mb-8">
            All Products
          </h1>

          {filteredProducts.length === 0 ? (
            <p className="text-muted-foreground">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {filteredProducts.map((product, index) => {

               

                return (
                  <div key={`${product.slug}-${index}`}>
                    <Link href={`/products/${product.slug}`} className="group block">
                      <div
                        className="
                          bg-white rounded-2xl shadow-sm
                          transition-all hover:shadow-xl hover:-translate-y-1
                          h-[360px] sm:h-auto
                          flex flex-col
                        "
                      >
                        {/* IMAGE */}
                        <div className="relative aspect-[4/5] bg-gray-50 rounded-t-xl overflow-hidden">
                          <Image
                            src={
                              product.primaryImage ||
                              product.images?.[0] ||
                              "/uploads/default-product.jpg"
                            }
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="
                              object-contain p-6
                              transition-all duration-300
                              group-hover:scale-105 group-hover:opacity-80
                            "
                          />

                          {product.featured && (
                            <span className="absolute top-4 left-4 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-md z-10">
                              Featured
                            </span>
                          )}

                          <div
                            className="
                              absolute inset-0
                              flex items-center justify-center
                              bg-black/40
                              opacity-0
                              transition-opacity duration-300
                              group-hover:opacity-100
                            "
                          >
                            <span className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-lg">
                              View Product
                            </span>
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-5 text-left space-y-1 flex-1">
                          <h3 className="mt-3 font-semibold line-clamp-2 text-gray-900">
                      {product.name}
                    </h3>

                    {/* Category */}
                    {product.categoryName && (
                      <p className="text-sm text-gray-500">
                        {product.categoryName}
                      </p>
                    )}

                        <div className="pt-2 space-y-1">

  <button
    onClick={(e) => {
      e.preventDefault();
      setSelectedProduct({
        id: product.id,
        name: product.name,
        category: product.categoryName,
      });
      setEnquiryOpen(true);
    }}
    className="
      mt-2
      inline-flex items-center justify-center
      rounded-md
      bg-gray-50
      px-4 py-2
      text-sm font-medium
      text-gray-800
      border border-gray-200
      hover:bg-gray-100
      transition
    "
  >
    Send Enquiry
  </button>


</div>

                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {selectedProduct && (
  <EnquiryModal
    open={enquiryOpen}
    onOpenChange={setEnquiryOpen}
    product={selectedProduct}
  />
)}
      
    </section>
    
  );
}


// "use client";

// import { useState, useMemo, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { formatPriceUSD } from '@/lib/price';
// import EnquiryModal from "@/components/enquiry-modals";

// type Props = {
//   categories: any[];
//   products: any[];
//   initialCategory: string | null;
//    usdRate: number;
// };

// /* ================= PRICE RANGES ================= */
// // const PRICE_RANGES = [
// //   { label: "Under ₹500", min: 0, max: 500 },
// //   { label: "Under ₹1000", min: 0, max: 1000 },
// //   { label: "Under ₹2000", min: 0, max: 2000 },
// //   { label: "Under ₹5000", min: 0, max: 5000 },
// //   { label: "Above ₹5000", min: 5000, max: Infinity },
// // ];

// export default function ProductsClient({
//   categories,
//   products,
//   initialCategory,
//   usdRate
// }: Props) {
//   /* ================= STATE ================= */
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   // const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [enquiryOpen, setEnquiryOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<{
//   id: string;
//   name: string;
//   category?: string;
// } | null>(null);

//   /* ================= APPLY URL CATEGORY ================= */
//   useEffect(() => {
//     if (!initialCategory || !categories.length) return;

//     const matchedCategory = categories.find(
//       (cat) => cat.slug === initialCategory
//     );

//     if (matchedCategory) {
//       setSelectedCategories([matchedCategory.name]);
//     }
//   }, [initialCategory, categories]);

//   /* ================= HANDLERS ================= */
//   const toggleCategory = (name: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(name)
//         ? prev.filter((c) => c !== name)
//         : [...prev, name]
//     );
//   };

//   // const togglePrice = (label: string) => {
//   //   setSelectedPrices((prev) =>
//   //     prev.includes(label)
//   //       ? prev.filter((p) => p !== label)
//   //       : [...prev, label]
//   //   );
//   // };

//   /* ================= FILTER LOGIC ================= */
//   const filteredProducts = useMemo(() => {
//     return products.filter((product) => {
//       const category =
//         product.categoryName || product.category;

//       const categoryMatch =
//         selectedCategories.length === 0 ||
//         selectedCategories.includes(category);

//       // const price =
//       //   product.discountedPrice ?? product.sellingPrice ?? 0;

//       // const priceMatch =
//       //   selectedPrices.length === 0 ||
//       //   selectedPrices.some((label) => {
//       //     const range = PRICE_RANGES.find(
//       //       (r) => r.label === label
//       //     );
//       //     if (!range) return false;
//       //     return price >= range.min && price <= range.max;
//       //   });

//       return (
//         categoryMatch &&
//       //  priceMatch &&
//         product.status === "active"
//       );
//     });
//   }, [products, selectedCategories]);

//   /* ================= UI ================= */
//   return (
//     <section className="container py-16">
//       <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

//   <aside
//   className={`
//     fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white p-6
//     transform transition-transform duration-300
//     lg:static lg:z-auto lg:w-auto lg:p-0
//     ${showFilters ? "translate-x-0" : "-translate-x-full"}
//     lg:translate-x-0
//   `}
// >
//   {/* 👇 STICKY WRAPPER */}
//  <div className="
//     lg:sticky
//     lg:top-16
//     lg:max-h-[calc(100vh-4rem)]
//     lg:overflow-y-auto
//     lg:pr-6
//   ">
//           {/* Mobile Header */}
//           <div className="flex items-center justify-between mb-6 lg:hidden">
//             <h3 className="text-lg font-semibold">Filters</h3>
//             <button
//               onClick={() => setShowFilters(false)}
//               className="text-xl font-bold"
//             >
//               ✕
//             </button>
//           </div>

//           <div className="space-y-8">
//             {/* Categories */}
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Categories</h3>
//               <div className="space-y-3">
//                 {categories.map((cat) => (
//                   <label
//                     key={cat.slug}
//                     className="flex items-center gap-3 text-sm cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedCategories.includes(cat.name)}
//                       onChange={() => toggleCategory(cat.name)}
//                       className="h-4 w-4"
//                     />
//                     <span>{cat.name}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Price */}
//             {/* <div>
//               <h3 className="text-lg font-semibold mb-4">Price</h3>
//               <div className="space-y-3">
//                 {PRICE_RANGES.map((range) => (
//                   <label
//                     key={range.label}
//                     className="flex items-center gap-3 text-sm cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedPrices.includes(range.label)}
//                       onChange={() => togglePrice(range.label)}
//                       className="h-4 w-4"
//                     />
//                     <span>{range.label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div> */}

//             {/* Apply Button */}
//             <button
//               onClick={() => setShowFilters(false)}
//               className="mt-6 w-full rounded-full bg-primary py-3 text-white lg:hidden"
//             >
//               Apply Filters
//             </button>
//           </div> </div>
//         </aside>

//         {/* Overlay */}
//         {showFilters && (
//           <div
//             className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//             onClick={() => setShowFilters(false)}
//           />
//         )}

//         {/* ================= PRODUCTS ================= */}
//         <div>
//           {/* Mobile Header */}
//           <div className="flex items-center justify-between mb-6 lg:hidden">
//             <h1 className="text-xl font-semibold">All Products</h1>
//             <button
//               onClick={() => setShowFilters(true)}
//               className="rounded-full border px-4 py-2 text-sm"
//             >
//               Filters
//             </button>
//           </div>

//           {/* Desktop Heading */}
//           <h1 className="hidden lg:block text-2xl font-semibold mb-8">
//             All Products
//           </h1>

//           {filteredProducts.length === 0 ? (
//             <p className="text-muted-foreground">
//               No products found.
//             </p>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
//               {filteredProducts.map((product, index) => {

//                 const isSandalPure = product.categoryName?.toLowerCase() === "sandal pure";
//                 const sellingPrice = product.sellingPrice ?? 0;
//                 const discountedPrice =
//                   product.discountedPrice ?? sellingPrice;

//                 return (
//                   <div key={`${product.slug}-${index}`}>
//                     <Link href={`/products/${product.slug}`} className="group block">
//                       <div
//                         className="
//                           bg-white rounded-2xl shadow-sm
//                           transition-all hover:shadow-xl hover:-translate-y-1
//                           h-[360px] sm:h-auto
//                           flex flex-col
//                         "
//                       >
//                         {/* IMAGE */}
//                         <div className="relative aspect-[4/5] bg-gray-50 rounded-t-xl overflow-hidden">
//                           <Image
//                             src={
//                               product.primaryImage ||
//                               product.images?.[0] ||
//                               "/uploads/default-product.jpg"
//                             }
//                             alt={product.name}
//                             fill
//                             sizes="(max-width: 768px) 100vw, 25vw"
//                             className="
//                               object-contain p-6
//                               transition-all duration-300
//                               group-hover:scale-105 group-hover:opacity-80
//                             "
//                           />

//                           {product.featured && (
//                             <span className="absolute top-4 left-4 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-md z-10">
//                               Featured
//                             </span>
//                           )}

//                           <div
//                             className="
//                               absolute inset-0
//                               flex items-center justify-center
//                               bg-black/40
//                               opacity-0
//                               transition-opacity duration-300
//                               group-hover:opacity-100
//                             "
//                           >
//                             <span className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-lg">
//                               View Product
//                             </span>
//                           </div>
//                         </div>

//                         {/* CONTENT */}
//                         <div className="p-5 text-left space-y-1 flex-1">
//                           <h3 className="mt-3 font-semibold line-clamp-2 text-gray-900">
//                       {product.name}
//                     </h3>

//                     {/* Category */}
//                     {product.categoryName && (
//                       <p className="text-sm text-gray-500">
//                         {product.categoryName}
//                       </p>
//                     )}

//                         <div className="pt-2 space-y-1">

//   {/* ✅ SANDAL PURE → SHOW PRICE */}
//   {isSandalPure && (
//     <div className="flex items-center gap-2">
//       {sellingPrice !== discountedPrice && (
//         <span className="text-sm text-gray-400 line-through">
//           {formatPriceUSD(sellingPrice, usdRate)}
//         </span>
//       )}
//       <span className="text-lg font-bold text-gray-900">
//         {formatPriceUSD(discountedPrice, usdRate)}
//       </span>
//     </div>
//   )}

//   {/* ✅ MOQ — ALWAYS SHOWN */}
//   {/* {product.minOrderQty && (
//     <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
//       MOQ: <span className="font-medium">{product.minOrderQty}</span>
//     </span>
//   )} */}

//   {/* ✅ NON–SANDAL PURE → ENQUIRY BUTTON */}
// {!isSandalPure && (
//   <button
//     onClick={(e) => {
//       e.preventDefault();
//       setSelectedProduct({
//         id: product.id,
//         name: product.name,
//         category: product.categoryName,
//       });
//       setEnquiryOpen(true);
//     }}
//     className="
//       mt-2
//       inline-flex items-center justify-center
//       rounded-md
//       bg-gray-50
//       px-4 py-2
//       text-sm font-medium
//       text-gray-800
//       border border-gray-200
//       hover:bg-gray-100
//       transition
//     "
//   >
//     Send Enquiry
//   </button>
// )}


// </div>

//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//       {selectedProduct && (
//   <EnquiryModal
//     open={enquiryOpen}
//     onOpenChange={setEnquiryOpen}
//     product={selectedProduct}
//   />
// )}
      
//     </section>
    
//   );
// }
