import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Truck, ShieldCheck,Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductCard } from '@/components/product-card';
import { getCategories } from '@/lib/models/Category';
import { getProducts } from '@/lib/models/Product';
import type { Category, Product } from '@/lib/types';
import HeroSlider from '@/components/hero-slider';
import CategorySlider from "@/components/category-slider";
import { formatPriceUSD } from '@/lib/price';
import { getUsdRate } from '@/lib/getUsdRate';
import FeaturedProduct from "@/components/feature-product";



const promoBanners = [
  {
    id: 1,
    title: "20% Off on Sandal Cream",
    description:
      "Crafted from authentic sandalwood for deep nourishment and natural radiance..",
    buttonText: "SHOP NOW",
    image: "/uploads/banners/promo-1.jpg",
    link: "/sandal-pure",
  },
  {
    id: 2,
    title: "Grand Naine Fresh Bananas",
    description:
      "Carefully grown and harvested to deliver natural sweetness and consistent quality.",
    buttonText: "SHOP NOW",
    image: "/uploads/banners/promo-2.jpg",
    link: "/products/banana-grand-9g9",
  },
  {
    id: 3,
    title: "Premium Red Onions",
    description:
      "Carefully selected for strong flavor, long shelf life, and export-grade quality.",
    buttonText: "SHOP NOW",
    image: "/uploads/banners/promo-3.jpg",
    link: "/products/red-onion",
  },
];


async function getData() {
    try {
        const [categories, products] = await Promise.all([
            getCategories(),
            getProducts()
        ]);
        return { categories, products };
    } catch (error) {
        console.error("Failed to fetch data, falling back to mock data.", error);
        // Fallback to empty arrays in case of DB error
        return { categories: [], products: [] };
    }
}


export default async function HomePage() {
  const heroImage = { imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhZ3JpY3VsdHVyZSUyMGZpZWxkfGVufDB8fHx8MTc2NTgxMzQ2NXww&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "agriculture field" };
  const aboutImage = { imageUrl: "https://images.unsplash.com/photo-1659021245220-8cf62b36fe25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmYXJtZXJzJTIwd29ya2luZ3xlbnwwfHx8fDE3NjU4NjQwNTN8MA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "farmers working" };
  const usdRate = await getUsdRate();
  const { categories, products } = await getData();

  

const featuredProducts = products
  .filter((p) => p.featured && p.status === 'active')
  .slice(0, 8);  const featuredCategories = categories.filter(c => c.featured && c.status === 'active');
  



  return (
    <div className="flex flex-col">
    
    {/* Hero Slider Section */}
 <HeroSlider />

      {/* Featured Categories */}
    
<CategorySlider featuredCategories={featuredCategories} />

{/* ================= Promo Banners ================= */}

<section className="section bg-white">
  <div className="container">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {promoBanners.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="group relative h-[420px] overflow-hidden"
        >
          {/* Background Image */}
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h3 className="text-xl font-semibold leading-tight">
              {item.title}
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-white/90">
              {item.description}
            </p>

            <span className="mt-6 inline-block w-fit bg-white px-8 py-3 text-sm font-semibold tracking-wide text-black transition group-hover:bg-black group-hover:text-white">
              {item.buttonText}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>


{/*==================== Featured Products Section ================= */}

<FeaturedProduct products={products} usdRate={usdRate} />


{/* ================= Sandal Pure Section ================= */}

<section className="relative bg-[#020001] overflow-hidden">
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr]">

    {/* IMAGE — TOP ON MOBILE, RIGHT ON DESKTOP */}
    <div className="relative h-[320px] sm:h-[380px] lg:h-auto lg:min-h-[600px] overflow-hidden order-1 lg:order-2">
      <Link href="/sandal-pure">
        <Image
          src="/uploads/banners/banner-6.png"
          alt="Sandal Pure Product Range"
          fill
          priority
          className="object-cover object-center lg:object-left"
        />
      </Link>
    </div>

    {/* TEXT — BELOW IMAGE ON MOBILE */}
    <div className="order-2 lg:order-1 px-6 sm:px-10 lg:px-16 py-14 sm:py-16 lg:py-20 flex items-center justify-center lg:justify-start">
      <div className="max-w-xl text-center lg:text-left">

        <span className="inline-block rounded-full bg-[#caa24d]/20 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#e6c77a]">
          Featured Brand
        </span>

        <h2
          className="
            mt-4 sm:mt-6
            font-headline font-bold
            text-3xl sm:text-4xl md:text-5xl
            bg-gradient-to-r from-[#f5d88c] via-[#e6b65c] to-[#caa24d]
            bg-clip-text text-transparent
          "
        >
          Sandal Pure
        </h2>

        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#e7dbc6]">
          A premium range of 100% sandalwood-based herbal creams,
          cultivated, processed, and delivered directly by sandalwood farmers.
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start">
          <Link href="/sandal-pure">
            <Button
              className="
                px-6 sm:px-8
                py-2.5 sm:py-3
                text-sm sm:text-base
                bg-gradient-to-r from-[#f5d88c] to-[#caa24d]
                text-black
              "
            >
              Explore Sandal Pure
            </Button>
          </Link>
        </div>

      </div>
    </div>

  </div>
</section>

{/* ================= How We Work Section ================= */}


<section className="py-14 bg-white">
  <div className="container">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto">
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        How We Work
      </span>
      <h2 className="mt-4 font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
        From Farm to Global Delivery
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Our export process ensures freshness, quality, and reliability
        at every stage of the supply chain.
      </p>
    </div>

    {/* Timeline */}
    <div className="relative mt-24">

      {/* Connector Line */}
      <div className="absolute left-0 right-0 top-8 hidden lg:block h-1 bg-primary/20" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

       {[
  {
    title: "Own Farm Cultivation",
    desc: "Produce grown on our own farms using best agricultural practices.",
  },
  {
    title: "Crop Monitoring & Harvest",
    desc: "Careful monitoring and timely harvesting for optimal quality.",
  },
  {
    title: "Quality Grading",
    desc: "Strict grading and sorting to meet export standards.",
  },
  {
    title: "Processing & Packaging",
    desc: "Hygienic processing and secure packaging to retain freshness.",
  },
  {
    title: "Global Export",
    desc: "Complete export handling and timely delivery worldwide.",
  },
].map((step, index) => (

          <div
            key={index}
            className="relative text-center"
          >
            {/* Step Circle */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-xl font-bold shadow-lg">
              {index + 1}
            </div>

            {/* Content */}
            <h3 className="mt-6 text-xl font-bold text-gray-900">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>

{/* ================= Testimonials Section ================= */}


<section className="mt-5 pb-10 bg-white">
  <div className="container">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto">
    <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Testimonials
      </span>
        <h2 className="text-center font-headline text-4xl font-bold tracking-tight">
        Trusted by Global Buyers    
          </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        What our clients say about working with Riva Agro Exports.
      </p>
    </div>

    {/* Horizontal Reviews */}
    <div className="mt-20">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="relative w-full overflow-x-clip"
      >

        <div className="overflow-hidden">

        <CarouselContent>

          {[
            {
              review:
                "Riva Agro Exports’ own farming model ensures consistent quality and transparency throughout the export process.",
              name: "Ahmed Al Noor",
              meta: "FreshMart Trading LLC · UAE",
            },
            {
              review:
                "Excellent grading standards and reliable delivery schedules. A professional export partner.",
              name: "Daniel Thompson",
              meta: "Global Food Imports · UK",
            },
            {
              review:
                "Complete control from cultivation to export makes them stand apart from traders.",
              name: "Rahul Mehta",
              meta: "AgroWorld Distributors · India",
            },
            {
              review:
                "Consistent quality, hygienic packaging, and timely shipments across markets.",
              name: "Khalid Hassan",
              meta: "Middle East Produce Co. · Qatar",
            },
          ].map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-[85%] sm:basis-1/2 lg:basis-1/3"

            >
              <div className="h-full rounded-2xl border border-gray-200 p-8">

                {/* Stars */}
                <div className="flex gap-1 text-yellow-400 text-sm">
                  ★★★★★
                </div>

                {/* Review */}
                <p className="mt-4 text-base leading-relaxed text-gray-700">
                  “{item.review}”
                </p>

                {/* Client */}
                <div className="mt-6">
                  <p className="font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.meta}
                  </p>
                </div>

              </div>
            </CarouselItem>
          ))}

        </CarouselContent>
      </div>
<CarouselPrevious className="left-4 max-w-full" />
<CarouselNext className="right-4 max-w-full" />
      </Carousel>
    </div>

  </div>
</section>
   
{/* Why Choose Us */}
<section className="relative py-24 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 overflow-hidden">
  {/* Background Accent */}
  <div className="absolute inset-y-0 right-0 w-1/2 bg-primary/5 -z-10 rounded-l-[120px]" />

  <div className="container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

    {/* Left Content */}
    <div>
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Why Choose Us
      </span>

      <h2 className="mt-6 font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
        Built on Trust,<br />
        Powered by Agriculture
      </h2>

      <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
        We don’t just export products — we build long-term partnerships by
        delivering consistent quality, reliable logistics, and certified
        agricultural exports across global markets.
      </p>

      {/* Divider */}
      <div className="mt-10 h-1 w-20 rounded-full bg-primary" />
    </div>

    {/* Right Features */}
    <div className="space-y-10">

      {/* Item 1 */}
      <div className="flex gap-6 items-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
          <Leaf className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Farm-Fresh Quality
          </h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Direct sourcing from trusted farmers ensures freshness,
            traceability, and premium quality in every shipment.
          </p>
        </div>
      </div>

      {/* Item 2 */}
      <div className="flex gap-6 items-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
          <Truck className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Global Supply Chain
          </h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Our logistics network guarantees timely, secure delivery to
            international destinations with minimal handling.
          </p>
        </div>
      </div>

      {/* Item 3 */}
      <div className="flex gap-6 items-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Certified & Compliant
          </h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Fully compliant with international export standards,
            certifications, and quality regulations.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

{/* CERTIFICATIONS & LICENSES */}
{/* CERTIFICATIONS & LICENSES */}
{/* CERTIFICATIONS & LICENSES */}
<section className="py-20 bg-white overflow-hidden">
  <div className="container">

    {/* Heading */}
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-wide uppercase">
        Certifications & Licenses
      </h2>
      <div className="mx-auto mt-4 h-1 w-24 bg-primary" />
    </div>

    {/* Slider */}
    <div className="relative mt-16">
      <div className="flex gap-16 animate-certifications whitespace-nowrap items-center">

        {[
          "fssai",
          "apeda",
          "iec",
          "msme",
          "udyog-aadhaar",
          "dgft",
          "gst",
        ].map((logo) => (
          <div
            key={logo}
            className="flex items-center justify-center min-w-[180px]"
          >
            <img
              src={`/uploads/certificates/${logo}.png`}
              alt={`${logo} certification`}
              className="h-20 object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}

        {/* Duplicate for infinite scroll */}
        {[
          "fssai",
          "apeda",
          "iec",
          "msme",
          "udyog-aadhaar",
          "dgft",
          "gst",
        ].map((logo) => (
          <div
            key={`dup-${logo}`}
            className="flex items-center justify-center min-w-[180px]"
          >
            <img
              src={`/uploads/certificates/${logo}.png`}
              alt={`${logo} certification`}
              className="h-20 object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>

    {/* Trust Line */}
    <p className="mt-14 text-center text-muted-foreground max-w-2xl mx-auto">
      Our certifications reflect our commitment to quality, compliance,
      and ethical agricultural exports that meet global trade standards.
    </p>

  </div>
</section>


    </div>

     
  );
}