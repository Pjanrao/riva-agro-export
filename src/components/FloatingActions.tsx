"use client";

import Image from "next/image";
import { Phone } from "lucide-react";

export default function FloatingActions() {
  return (
    <>
      {/* CALL BUTTON — LEFT */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="tel:+919687725260" // replace
          aria-label="Call Us"
          className="
            flex h-14 w-14 items-center justify-center
            rounded-full bg-green-600
            shadow-xl hover:scale-105 transition
          "
        >
          <Phone className="h-7 w-7 text-white" />
        </a>
      </div>

      {/* WHATSAPP BUTTON — RIGHT */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/919687725260" // replace
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="
            flex h-14 w-14 items-center justify-center
            rounded-full bg-[#25D366]
            shadow-xl hover:scale-105 transition
          "
        >
          <Image
           src="/uploads/64px-WhatsApp.svg.png"
           alt="WhatsApp"
           width={32}
           height={32}
           
         
         />
        </a>
      </div>
    </>
  );
}
