import Link from "next/link";
import { Logo } from "../icons/logo";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t">
      <div className="container py-14">

        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

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
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>
                  Riva Agro Exports<br />
                  Maharashtra, India
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <Link href="tel:+918000028181" className="hover:text-primary transition">
                  +91 8000028181 / +91 9687725260
                </Link>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>info@rivaagroexports.com</span>
              </li>
            </ul>
          </div>

          {/* 4️⃣ Farm Location (Map Column) */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900">
              Farm Location
            </h4>

            <div className="mt-4 rounded-lg overflow-hidden border">
              <iframe
                title="Riva Agro Farm Location"
                src="https://www.google.com/maps?q=21.416306,74.454417&output=embed"
                width="100%"
                height="180"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>

            <p className="mt-3 text-xs text-muted-foreground flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-[2px]" />
              21°24'58.7&quot;N 74°27'15.9&quot;E
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
