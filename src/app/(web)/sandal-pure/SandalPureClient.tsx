"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import EnquiryModal from "@/components/enquiry-modals";

export default function SandalPureProducts({ products }: { products: any[] }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
    <>
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
        {products.map((product) => {
          // 🔧 ONLY ADDITION: normalize image value safely
          const imageSrc =
            typeof product.primaryImage === "string"
              ? product.primaryImage.trim()
              : Array.isArray(product.primaryImage)
              ? product.primaryImage[0]
              : "/uploads/default-product.jpg";

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition">
                <div className="relative aspect-[4/5] bg-gray-50 rounded-t-xl overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                  />
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {product.name}
                  </h3>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedProduct(product);
                      setEnquiryOpen(true);
                    }}
                    className="mt-2 rounded-md border px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100"
                  >
                    Send Enquiry
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

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


// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import EnquiryModal from "@/components/enquiry-modals";

// export default function SandalPureProducts({ products }: { products: any[] }) {
//   const [enquiryOpen, setEnquiryOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);

//   return (
//     <>
//       <div className="mt-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
//         {products.map((product) => (
          
//          <Link
//             key={product.id}
//             href={`/products/${product.slug}`}
//             className="group block"
//           >
//             <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition">
//               <div className="relative aspect-[4/5] bg-gray-50 rounded-t-xl overflow-hidden">
//                 <Image
//                   src={product.primaryImage || "/uploads/default-product.jpg"}
//                   alt={product.name}
//                   fill
//                   className="object-contain p-6"
//                 />
//               </div>                  

//               <div className="p-5 space-y-2">
//                 <h3 className="text-sm font-semibold line-clamp-2">
//                   {product.name}
//                 </h3>

//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setSelectedProduct(product);
//                     setEnquiryOpen(true);
//                   }}
//                   className="mt-2 rounded-md border px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100"
//                 >
//                   Send Enquiry
//                 </button>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {selectedProduct && (
//         <EnquiryModal
//           open={enquiryOpen}
//           onOpenChange={setEnquiryOpen}
//           product={selectedProduct}
//         />
//       )}
//     </>
//   );
// }
