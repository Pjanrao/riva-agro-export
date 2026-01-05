import Link from "next/link";
import { Logo } from "../icons/logo";
import { Github, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/products", label: "Products" },
        { href: "/contact", label: "Contact Us" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms-conditions", label: "Terms & Conditions" },
        { href: "/export-policy", label: "Export Policy" },
      ],
    },
  ];

  return (
<footer className="bg-secondary border-t">
  <div className="container py-14">

        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

          {/* Brand Column */}
          <div className="space-y-5">
            <Logo />

            <p className="text-sm leading-relaxed text-muted-foreground">
              Riva Agro Exports is a globally trusted exporter of premium
              agricultural products, delivering farm-fresh quality from India
              to international markets.
            </p>

       
          </div>

          {/* Company Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-lg text-gray-900">
                {section.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Exporter Info Column */}
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



<li className="flex flex-col gap-3 text-sm text-muted-foreground">

  {/* Phone */}
  <div className="flex items-center gap-3">
    <Phone className="h-5 w-5 text-primary shrink-0" />
    <Link
      href="tel:+918000028181"
      className="hover:text-primary transition"
    >
      +91 8000028181
    </Link>
  </div>

  {/* WhatsApp */}
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
      href="https://wa.me/918000028181?text=Hello%2C%20I%20am%20interested%20in%20your%20export%20products.%20Please%20share%20details."
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary transition"
    >
      Enquire on WhatsApp
    </Link>
  </div>

</li>



              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@rivaagroexports.com</span>
              </li>

            </ul>
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