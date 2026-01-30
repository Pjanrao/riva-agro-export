import Image from "next/image";
import { Leaf, Truck, ShieldCheck } from 'lucide-react';
import { MapPin, Phone, Mail } from "lucide-react";


export default function AboutPage() {
  return (
  <>
{/* HERO BANNER */}
<section className="relative h-[60vh] flex items-center justify-center bg-black">
  <img
    src="uploads/banners/shipcontainer.png"
    alt="Riva Agro Exports"
    className="absolute inset-0 h-full w-full object-cover opacity-70"
  />

  <div className="relative z-10 text-center text-white max-w-3xl px-6">
    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
      About Riva Agro Exports
    </h1>
    <p className="mt-4 text-lg text-white/90">
      Delivering premium agricultural produce from Indian farms to global markets
    </p>
  </div>
</section>

  {/* ================= WHO WE ARE ================= */}
<section className="py-20 bg-secondary">
  <div className="container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

    {/* Left Content */}
    <div>
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Who We Are
      </span>

      <h3 className="mt-6 font-headline text-4xl md:text-4xl font-bold tracking-tight text-gray-900">
        A Trusted Name in<br />Agricultural Exports
      </h3>

      <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
        Riva Agro Exports is an India-based agricultural export company
        committed to delivering premium-quality farm produce to
        international markets. We work closely with farmers, processors,
        and logistics partners to ensure reliability at every stage.
      <br />
        Our focus is simple — quality sourcing, ethical trade, and
        long-term partnerships with global buyers.
      </p>
    </div>

    {/* Right Image */}
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
      <Image
        src="/uploads/export-containers.png"
        alt="Agricultural export sourcing"
        fill
        className="object-cover"
      />
    </div>

  </div>
</section>
{/* ================= COMPANY PROFILE ================= */}
<section className="py-6 bg-secondary">
  <div className="container max-w-6xl">

    {/* Heading */}
    <div className="text-center mb-8">
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Company Profile
      </span>

      <h3 className="mt-6 font-headline text-4xl md:text-4xl font-bold tracking-tight text-gray-900">
        Business Overview
      </h3>
    </div>

    {/* Table Card */}
    <div className="bg-white rounded-3xl border shadow-sm overflow-hidden mb-6">

      <div className="divide-y">

        {[
          ["Name of Founder", "Mr. Tejas Marathe and Ms. Kushalbai Shirsath"],
          ["Year of Establishment", "2025"],
          ["Name of Company", "Riva Agro Exports"],
          ["Nature of Business", "Export Company"],
          [
            "Products Offered",
            "Banana, Custurd Apple, Chickpea, Chilli, Onion, Lemon, Corn, Sandal Wood, Sandal Pure",
          ],
          [
            "Certification & Licenses",
            "IEC | MSME | APEDA | FSSAI | GSTIN",
          ],
          [
            "Our Vision",
            "To establish Vision Infinity Trade as a globally recognized and trusted name in rice exports by delivering unmatched quality, sustainability, and reliability to international markets.",
          ],
         
        ].map(([label, value], index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[280px_1fr]"
          >
            {/* Label */}
            <div className="bg-[#256368] text-white px-6 py-4 font-semibold">
              {label}
            </div>

            {/* Value */}
            <div className="px-6 py-4 text-muted-foreground leading-relaxed">
              {value}
            </div>
          </div>
        ))}

      </div>
    </div>

  </div>
</section>
{/* ================= FOUNDERS / LEADERSHIP ================= */}
<section className="py-20 bg-white">
  <div className="container max-w-6xl">

    {/* Heading */}
    <div className="text-center mb-16">
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Leadership
      </span>

      <h3 className="mt-6 font-headline text-4xl font-bold tracking-tight text-gray-900">
        Founders & Management
      </h3>
    </div>

    {/* Founders Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

      {/* ================= Founder 1 ================= */}
      <div className="flex flex-col items-center text-center">

        {/* Photo */}
<div className="relative w-[260px] h-[360px] rounded-3xl overflow-hidden shadow-lg border bg-white flex items-center justify-center">
          <Image
            src="/uploads/founder.png"
            alt="Mr. Tejas Marathe - Founder"
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <h3 className="mt-8 text-2xl font-bold text-gray-900">
          Mr. Tejas Marathe
        </h3>

        <p className="mt-1 text-sm font-medium text-primary">
          Founder & Owner — Farm & Export Operations
        </p>

        <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
          Mr. Tejas Marathe is the founder and owner of Riva Agro Exports and
          the agricultural farms supplying export-grade produce. With deep
          hands-on experience in farming and international trade, he leads
          cultivation, quality control, and global export operations.
        </p>

        {/* Highlights */}
        <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xl font-bold">10+</p>
            <p className="text-xs text-muted-foreground">Years Farming</p>
          </div>

          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xl font-bold">Global</p>
            <p className="text-xs text-muted-foreground">Export Reach</p>
          </div>

          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xl font-bold">100%</p>
            <p className="text-xs text-muted-foreground">Own Farms</p>
          </div>
        </div>
      </div>

      {/* ================= Co-Founder ================= */}
      <div className="flex flex-col items-center text-center">

        {/* Photo */}
<div className="relative w-[260px] h-[360px] rounded-3xl overflow-hidden shadow-lg border bg-white flex items-center justify-center">
          <Image
            src="/uploads/co-founder.png"
            alt="Ms. Kushalbai Ashok Shirsath - Co-Founder"
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <h3 className="mt-8 text-2xl font-bold text-gray-900">
          Ms. Kushalbai Ashok Shirsath
        </h3>

        <p className="mt-1 text-sm font-medium text-primary">
          Co-Founder — Corporate, Documentation & Finance
        </p>

        <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
          Ms. Kushalbai Ashok Shirsath is the Co-Founder of Riva Agro Exports, managing corporate operations, export documentation, and finance. With expertise in administration and compliance, she ensures smooth, transparent, and efficient business operations.
        </p>

        

        {/* Highlights */}
        <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xl font-bold">Admin</p>
            <p className="text-xs text-muted-foreground">Operations</p>
          </div>

          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xl font-bold">Export</p>
            <p className="text-xs text-muted-foreground">Documentation</p>
          </div>

          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xl font-bold">Finance</p>
            <p className="text-xs text-muted-foreground">Management</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>


{/* ================= OUR MISSION ================= */}
<section className="pt-20 pb-10 bg-secondary">
  <div className="container max-w-5xl ">

    {/* Heading (same pattern as others) */}
    <div className="text-center mb-12">
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Our Mission
      </span>

      <h3 className="mt-4 font-headline text-xl md:text-4xl font-bold tracking-tight text-gray-900">
        Delivering Excellence From Farm to World
      </h3>

      <p className="mt-6 text-lg text-muted-foreground max-w-8xl mx-auto leading-relaxed">
        We are committed to connecting Indian farmers with global markets by
        exporting premium-quality agricultural products through ethical
        sourcing, strict quality control, and reliable international logistics.
      </p>
    </div>

    {/* Mission Content */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

      <div className="bg-white rounded-2xl p-8 border shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">
          Quality at Source
        </h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Direct sourcing from trusted farmers ensures freshness,
          traceability, and adherence to global quality standards.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">
          Ethical & Transparent Trade
        </h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          We follow responsible sourcing practices and transparent
          trade processes that build long-term trust with buyers.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">
          Global Reliability
        </h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Through dependable logistics and compliance, we ensure
          timely delivery to international destinations.
        </p>
      </div>

    </div>

    {/* Closing Line */}
    <div className="mt-10 text-center">
      <p className="text-lg font-medium italic">
        “Building a globally trusted agro export brand — one shipment at a time.”
      </p>
    </div>

  </div>
</section>



{/* ================= OUR LOCATIONS ================= */}
<section className="py-10 bg-secondary">
  <div className="container max-w-6xl">

    {/* Heading */}
    <div className="text-center mb-16">
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Our Locations
      </span>

      <h3 className="mt-6 font-headline text-4xl md:text-4xl font-bold tracking-tight text-gray-900">
        From Farm to Corporate Operations
      </h3>

    
    </div>

    {/* Locations Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

      {/* FARM LOCATION */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-8">
          <h4 className="text-xl font-semibold text-gray-700">
            Farm Location
          </h4>
       

          <p className="mt-4 font-medium text-sm text-muted-foreground">
            📍 SR NO 110/2/A OSARLI MANJARE OSARI MANJARE NANDURB AR NANDURBAR Osarli 425412
          </p>
        </div>

        {/* Map */}
        <div className="relative h-[250px]">
        <iframe
  src="https://www.google.com/maps?q=21.416306,74.454417&hl=en&z=15&output=embed"
  className="absolute inset-0 h-full w-full border-0"
  loading="lazy"
  allowFullScreen
  referrerPolicy="no-referrer-when-downgrade"
/>
        </div>
      </div>

      {/* CORPORATE OFFICE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-8">
          <h4 className="text-xl font-semibold text-gray-700">
            Corporate Office
          </h4>
       
          <p className="mt-4 font-medium text-sm text-muted-foreground">
            📍 209 SAI HEAVEN APPARTMENT CHALTHAN <br/>SURAT GUJARAT 394305  </p>
        </div>

        {/* Map */}
        <div className="relative h-[250px]"> 
               <iframe
  src="https://www.google.com/maps?q=21.155889,72.957694&hl=en&z=15&output=embed"
  className="absolute inset-0 h-full w-full border-0"
  loading="lazy"
  allowFullScreen
  referrerPolicy="no-referrer-when-downgrade"
/>
        
        </div>
      </div>

    </div>

  </div>
</section>
  
      {/* Why Choose Us Section */}
{/* Why Choose Us – Alternate Design */}
<section className="relative py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 overflow-hidden">
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
<section className="py-20 bg-white">
  <div className="container">

    {/* Heading */}
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-wide uppercase">
        Certification & Licenses
      </h2>
      <div className="mx-auto mt-4 h-1 w-24 bg-primary" />
    </div>

    {/* Certificates Grid */}
    <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 items-center">

      {/* FSSAI */}
      <div className="flex items-center justify-center">
        <img
          src="/uploads/certificates/fssai.png"
          alt="FSSAI Certification"
          className="max-h-16 object-contain"
        />
      </div>

      {/* APEDA */}
      <div className="flex items-center justify-center">
        <img
          src="/uploads/certificates/apeda.png"
          alt="APEDA Certification"
          className="max-h-16 object-contain"
        />
      </div>

      {/* IEC */}
      <div className="flex items-center justify-center">
        <img
          src="/uploads/certificates/iec.png"
          alt="Import Export Code"
          className="max-h-16 object-contain"
        />
      </div>

      {/* MSME */}
      <div className="flex items-center justify-center">
        <img
          src="/uploads/certificates/msme.png"
          alt="MSME Registered"
          className="max-h-16 object-contain"
        />
      </div>

      {/* Udyog Aadhaar */}
      <div className="flex items-center justify-center">
        <img
          src="/uploads/certificates/udyog-aadhaar.png"
          alt="Udyog Aadhaar"
          className="max-h-16 object-contain"
        />
      </div>

      {/* DGFT */}
      <div className="flex items-center justify-center">
        <img
          src="/uploads/certificates/dgft.png"
          alt="Directorate General of Foreign Trade"
          className="max-h-16 object-contain"
        />
      </div>

    </div>

    {/* Trust Line */}
    <p className="mt-14 text-center text-muted-foreground max-w-2xl mx-auto">
      Our certifications reflect our commitment to quality, compliance,
      and ethical agricultural exports that meet global trade standards.
    </p>

  </div>
</section>


  </>
  );
}