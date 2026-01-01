"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const heroSlides = [
  {
    imageUrl: "/uploads/banners/banner-1.png",
    heading: "Freshness Delivered, Globally.",
    subheading: "Sourcing the highest quality agricultural products for you.",
    textAlign: "right",
  },
  {
    imageUrl: "/uploads/banners/banner-2.png",
    heading: "From Farm to World",
    subheading: "Connecting farmers to international markets.",
    textAlign: "right",
  },
  {
    imageUrl: "/uploads/banners/banner-4.png",
    heading: "Trusted Agro Export Partner",
    subheading: "Quality, reliability, and global reach.",
    textAlign: "left",
  },
  {
    imageUrl: "/uploads/banners/banner-7.png",
    heading: "Pure Sandalwood. Pure Skincare.",
    subheading: "Natural, and herbal products made from sandalwood.",
    textAlign: "right",
  },
];

export default function HeroSlider() {
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  );

  return (
    <section className="relative w-full overflow-hidden text-white">
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="relative w-full overflow-x-clip"
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] w-full"
            >
              {/* Background Image */}
              <Image
                src={slide.imageUrl}
                alt={slide.heading}
                fill
                priority={index === 0}
                className="object-cover"
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-black/50 z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10" />

              {/* Content */}
              <div
                className={`
                  relative z-20 flex h-full items-center
                  px-4 sm:px-8 md:px-16
                  justify-center
                  md:${slide.textAlign === "left" ? "justify-start text-left" : "justify-end text-right"}
                `}
              >
                <div
                  className={`
                    max-w-xl text-center md:text-inherit
                    animate-[fadeUp_0.8s_ease-out]
                  `}
                >
                  <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    {slide.heading}
                  </h1>

                  <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-white/90">
                    {slide.subheading}
                  </p>

                  {/* CTAs */}
                  <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-inherit">
                    <Button
                      asChild
                      className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-[#d4af37] text-black hover:bg-[#c9a227]"
                    >
                      <Link href="/contact">Get a Quote</Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                    >
                      <Link href="/products">Find More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation */}
        <CarouselPrevious className="left-3 sm:left-6 bg-white/90 hover:bg-white text-black shadow-lg" />
        <CarouselNext className="right-3 sm:right-6 bg-white/90 hover:bg-white text-black shadow-lg" />
      </Carousel>
    </section>
  );
}
