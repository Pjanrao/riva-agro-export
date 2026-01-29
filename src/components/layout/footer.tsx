import Link from "next/link";
import { Logo } from "../icons/logo";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t">
      <div className="container py-14">

        {/* Top Grid */}
<div className="grid grid-cols-1 gap-10 md:grid-cols-5">

          {/* 1️⃣ Brand Column */}
          <div className="space-y-7">
            <Logo />

            <p className="text-sm leading-relaxed text-muted-foreground">
              Riva Agro Exports is a globally trusted exporter of premium
              agricultural products, delivering farm-fresh quality from India
              to international markets.
            </p>
          </div>

          {/* 2️⃣ Pages (Merged Company + Legal) */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900">
              Pages
            </h4>

            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-primary transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/export-policy" className="hover:text-primary transition">
                  Export Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* 3️⃣ Exporter Info */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900">
              Exporter Info
            </h4>

            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
            

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <Link href="tel:+919687725260" className="hover:text-primary transition">
                 +91 9687725260  / +91 8000028181
                </Link>
              </li>
              
              <li>

 <div className="flex items-center gap-3">
    {/* WhatsApp Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className="h-5 w-5 text-green-600 shrink-0"
      fill="currentColor"
    >
      <path d="M16.003 3C9.373 3 4 8.372 4 15.002c0 2.646.86 5.08 2.317 7.05L4 29l7.16-2.28a11.92 11.92 0 0 0 4.843 1.02h.001c6.63 0 12.003-5.372 12.003-12.002C28.006 8.372 22.633 3 16.003 3zm6.79 16.682c-.287.81-1.437 1.49-2.01 1.55-.53.06-1.22.086-1.97-.12-.45-.12-1.03-.33-1.78-.65-3.14-1.36-5.18-4.52-5.33-4.73-.15-.21-1.28-1.7-1.28-3.25 0-1.55.81-2.31 1.1-2.62.29-.31.64-.39.85-.39.21 0 .43 0 .62.01.2.01.47-.07.73.56.27.65.92 2.25 1 2.42.08.17.13.36.02.57-.11.21-.17.36-.33.55-.17.19-.35.42-.5.57-.17.17-.35.36-.15.7.21.34.94 1.56 2.02 2.53 1.38 1.23 2.55 1.62 2.89 1.8.34.17.55.15.76-.09.21-.24.87-1.02 1.1-1.37.23-.36.46-.3.77-.18.31.12 1.97.93 2.31 1.1.34.17.56.26.64.41.08.15.08.85-.21 1.66z"/>
    </svg>

    <Link
      href="https://wa.me/919687725260?text=Hello%2C%20I%20am%20interested%20in%20your%20export%20products.%20Please%20share%20details."
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary transition"
    >
      Enquire on WhatsApp
    </Link>
  </div>

</li>
 <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>rivaagroexports@gmail.com</span>
              </li>

    {/* Country */}
    <li className="flex items-center gap-3">
      <MapPin className="h-5 w-5 text-primary shrink-0" />
      <span>Country of Origin: India 🇮🇳</span>
    </li>

             
            </ul>
          </div>

          {/* 4️⃣ Farm Location (Map Column) */}
         <div>
  <h4 className="font-semibold text-lg text-gray-900">
    Farm Location
  </h4>

  <p className="mt-2 text-xs text-muted-foreground flex gap-2">
    <MapPin className="h-4 w-4 text-primary shrink-0 mt-[2px]" />
    SR No 110/2/A, Osarli Manjare, Nandurbar – 425412
  </p>

  <div className="mt-3 rounded-lg overflow-hidden border">
    <iframe
      src="https://www.google.com/maps?q=21.416306,74.454417&output=embed"
      height="150"
      loading="lazy"
      className="w-full"
    />
  </div>

  <p className="mt-2 text-xs text-muted-foreground">
    21°24'58.7"N 74°27'15.9"E
  </p>
</div>
           {/* 5️⃣ Corporate Office Location */}
<div>
  <h4 className="font-semibold text-lg text-gray-900">
    Corporate Office Location
  </h4>

  <p className="mt-2 text-xs text-muted-foreground flex gap-2">
    <MapPin className="h-4 w-4 text-primary shrink-0 mt-[2px]" />
    209 Sai Heaven Apartment, Chalthan, Surat – 394305
  </p>

  <div className="mt-3 rounded-lg overflow-hidden border">
    <iframe
      src="https://www.google.com/maps?q=21.155889,72.957694&output=embed"
      height="150"
      loading="lazy"
      className="w-full"
    />
  </div>

  <p className="mt-2 text-xs text-muted-foreground">
    21°09'21.2"N 72°57'27.7"E
  </p>
</div>


          
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Riva Agro Exports. All rights reserved.
          </p>

          <p className="text-sm text-muted-foreground">
            Proudly Exporting Indian Agriculture Worldwide 🌍
          </p>
        </div>

      </div>
    </footer>
  );
}
