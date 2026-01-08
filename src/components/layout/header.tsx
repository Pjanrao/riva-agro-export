// import Link from 'next/link';
// import Image from 'next/image';
// import { Facebook, Instagram, Linkedin, X, Youtube } from 'lucide-react';
// import { UserNav } from '@/components/user-nav';
// import { MainNav } from '@/components/main-nav';

// export default function Header() {
//   return (
//     <header className="sticky top-0 z-40 w-full">

//       {/* ================= LOGO (FLOATING ABOVE) ================= */}
//       <div className="absolute left-6 md:left-10 top-0 z-50">
//         <Link href="/">
//           <Image
//             src="/uploads/logo1.png"
//             alt="Riva Agro Exports"
//             width={260}
//             height={120}
//             priority
//             className="
//     h-20 md:h-28  w-auto object-contain
//     drop-shadow-[0_6px_8px_rgba(0,0,0,0.25)]
//   "
//           />
//         </Link>
//       </div>

//       {/* ================= HEADER BACKGROUND ================= */}
//       <div className="relative z-10">

//         {/* BLACK STRIP */}
//         <div className="w-full bg-black text-white">
//           <div className="container flex h-9 items-center justify-end gap-3">
//             {[Facebook, Instagram, Linkedin, X, Youtube].map(
//               (Icon, i) => (
//                 <Link
//                   key={i}
//                   href="#"
//                   className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition"
//                 >
//                   <Icon className="h-4 w-4" />
//                 </Link>
//               )
//             )}
//           </div>
//         </div>

//         {/* NAVBAR */}
//         <div className="w-full bg-white border-b border-black/10">
//           <div className="container flex h-12 md:h-20 items-center justify-end gap-4">
//             {/* <MainNav className="hidden md:flex" /> */}
//             <UserNav />
//           </div>
//         </div>

//       </div>
//     </header>
//   );
// }

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { Logo } from "../icons/logo";
// import { MainNav } from "@/components/main-nav";

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/rivaagroexports?igsh=aTMxa3Vlb3VxZG8=",
    label: "Instagram",
  },
  {
    icon: Facebook,
    href: "#",
    label: "Facebook",
  }, 
  {
    icon: Linkedin,
    href: "#",
    label: "LinkedIn",
  },
  {
    icon: Youtube,
    href: "#",
    label: "YouTube",
  },
];


export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full">
      {/* ================= BLACK STRIP ================= */}
      <div className="w-full bg-black text-white">
        <div className="container flex h-9 items-center justify-end gap-3">
               {socialLinks.map(({ icon: Icon, href, label }) => (           
               <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition"
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* ================= WHITE NAVBAR ================= */}
      <div className="w-full bg-white border-b border-black/10">
        <div className="container flex h-16 md:h-20 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/uploads/logo1.png"
              alt="Riva Agro Exports"
              width={280}
              height={120}
              priority
              className="
                h-16 md:h-20
                w-auto object-contain
                drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]
              "
            />
<div className="flex items-center">
    <Logo className="h-6 sm:h-7 md:h-8" />
               </div>
            </Link>

          {/* NAV / USER */}
          <div className="flex items-center gap-4">
            {/* <MainNav className="hidden md:flex" /> */}
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
