// src/app/(web)/sandal-pure/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import { getProducts } from "@/lib/models/Product";
import SandalPureProducts from "./SandalPureClient";

export const metadata: Metadata = {
  title: "Sandal Pure™ | Premium Sandalwood Skincare Products Exporter",
  description:
    "Sandal Pure™ is a premium Indian sandalwood skincare brand offering herbal creams made from 100% pure sandalwood. Manufacturer & exporter of natural skincare products.",
  keywords: [
    "sandalwood skincare",
    "sandalwood cream exporter",
    "herbal skincare products India",
    "sandalwood cosmetic manufacturer",
    "natural skincare export",
    "Sandal Pure",
  ],
  openGraph: {
    title: "Sandal Pure™ | Luxury Sandalwood Skincare",
    description:
      "Explore Sandal Pure’s complete range of sandalwood-based herbal skincare creams, crafted by sandalwood farmers for global markets.",
    type: "website",
  },
};

export default async function SandalPurePage() {
  const products = await getProducts();
  const SANDAL_PURE_CATEGORY_ID = "6948e0b8005ecdc6599ba47c";

  const sandalPureProducts = products.filter(
    (p) =>
      p.status === "active" &&
      (p.category?.toString?.() === SANDAL_PURE_CATEGORY_ID ||
        p.category === SANDAL_PURE_CATEGORY_ID)
  );

  return (
    <main className="bg-white">
      {/* ================= HERO ================= */}
      <section className="relative w-full h-[280px] sm:h-[360px] md:h-[450px] lg:h-[550px] overflow-hidden bg-black mb-16">
        <Image
          src="/uploads/banners/sandal-pure.png"
          alt="Sandal Pure Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </section>

      {/* ================= ABOUT ================= */}
      <section className="w-full bg-white py-18">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[460px] rounded-3xl overflow-hidden">
            <img
              src="/uploads/sandal-powder-bowl.png"
              alt="Indian Sandalwood Heritage"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="max-w-xl text-center lg:text-left">
            <p className="text-sm tracking-widest text-[#9c7c2e] uppercase">
              About Sandal Pure
            </p>

            <h2 className="mt-6 text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1c1c1c]">
              Crafted by the Farmers of{" "}
              <span className="text-[#b89b3f]">Pure Indian Sandalwood</span>
            </h2>

            <div className="mt-8 text-gray-700 space-y-5">
              <p>Sandal Pure is a brand created by the farmers of sandalwood.</p>
              <p>
                All our products are made from <strong>100% sandalwood</strong> —
                pure, natural, and effective.
              </p>
              <p>
                Because we cultivate, we produce, and we bring it directly to
                you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm tracking-widest uppercase text-[#9c2f2f]">
              Sandal Pure Collection
            </p>
            <h2 className="mt-4 font-headline text-4xl md:text-5xl font-bold text-[#2b0f0f]">
              Sandalwood Skincare Products
            </h2>
            <p className="mt-4 text-[#5f3a3a]">
              100% Herbal • Farmer Crafted • Export Quality
            </p>
          </div>

          {/* 👉 CLIENT COMPONENT */}
          <SandalPureProducts products={sandalPureProducts} />
        </div>
      </section>

      {/* ================= PURPOSE ================= */}
      <section className="w-full bg-[#f7f3eb] py-16 lg:py-28 mb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="max-w-xl">
            <p className="text-sm tracking-widest text-[#9c7c2e] uppercase">
              Our Purpose
            </p>

            <h2 className="mt-6 text-3xl md:text-4xl font-semibold text-[#1c1c1c]">
              Bringing the Healing Power of{" "}
              <span className="text-[#b89b3f]">Indian Sandalwood</span>
            </h2>

            <p className="mt-6 text-gray-700">
              To bring the medicinal and wellness benefits of Indian sandalwood
              to every home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              ["Fair Value for Farmers", "Respecting farmer efforts"],
              ["Herbal for Every Home", "Natural wellness products"],
              ["Purity & Quality", "No compromise on authenticity"],
              ["Natural Lifestyle", "Chemical-free living"],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-4 text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
