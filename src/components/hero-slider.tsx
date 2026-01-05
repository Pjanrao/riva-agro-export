'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import type { Product } from '@/lib/types';

/* ================= TYPES ================= */

type Banner = {
  id: string;
  heading: string;
  subHeading?: string;
  image: string;

  button1Text: string;
  button1Link: string;

  button2Text?: string;
  productId?: string;

  order: number;
  status: 'active' | 'inactive';
};
const getHeroImage = (url: string) => {
  if (!url.includes('res.cloudinary.com')) return url;

  return url.replace(
    '/upload/',
    '/upload/c_pad,w_1920,h_1080,b_white,g_west,x_200,y_-120,q_auto,f_auto/'
  );
};

/* ================= COMPONENT ================= */

export default function HeroSlider() {
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  );

  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBanners(
            data
              .filter((b) => b.status === 'active')
              .sort((a, b) => a.order - b.order)
          );
        }
      });

    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts);
  }, []);


  /* ================= HELPERS ================= */

  const getProductLink = (productId?: string) => {
    if (!productId) return '/products';

    const product = products.find((p) => p.id === productId);
    return product ? `/products/${product.slug}` : '/products';
  };

  /* ================= UI ================= */

  return (
    <section className="relative h-[70vh] w-full overflow-hidden text-white">
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="relative w-full overflow-x-clip"
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem
              key={banner.id}
              className="relative h-[70vh] w-full"
            >
              <Image
  src={getHeroImage(banner.image)}
                alt={banner.heading}
                fill
                priority={index === 0}
                className="object-cover object-center"
              />

              {/* overlays */}
              <div className="absolute inset-0 bg-black/40 z-10" />
<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/40 z-10" />

              {/* CONTENT – RIGHT SIDE */}
              <div className="relative z-20 flex h-full items-center justify-end px-8 md:px-16 text-right">
                <div className="max-w-xl animate-[fadeUp_0.8s_ease-out]">
                  <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight">
                    {banner.heading}
                  </h1>

                  {banner.subHeading && (
                    <p className="mt-5 text-lg md:text-xl text-white/90">
                      {banner.subHeading}
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap gap-4 justify-end">
                    {/* Button 1 */}
                    <Button
                      asChild
                      size="lg"
                      className="bg-[#d4af37] text-black hover:bg-[#c9a227]"
                    >
                      <Link href={banner.button1Link}>
                        {banner.button1Text}
                      </Link>
                    </Button>

                    {/* Button 2 */}
                    {banner.button2Text && (
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="
                          border-[#d4af37] text-[#d4af37]
                          hover:bg-[#d4af37] hover:text-black
                        "
                      >
                        <Link
                          href={getProductLink(
                            banner.productId
                          )}
                        >
                          {banner.button2Text}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 bg-white/90 text-black hover:bg-white shadow-lg" />
        <CarouselNext className="right-4 bg-white/90 text-black hover:bg-white shadow-lg" />
      </Carousel>
    </section>
  );
}
