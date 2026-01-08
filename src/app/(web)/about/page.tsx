import Image from 'next/image';
import { Leaf, ShieldCheck, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
    <section className="relative h-[60vh] min-h-[420px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1659021245220-8cf62b36fe25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
          alt="Farmers working together"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center">
          <div className="container max-w-4xl">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              About Riva Agro Exports
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Bridging fertile farms with global markets through quality,
              trust, and sustainable agricultural exports.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
<section className="py-24 bg-secondary">
  <div className="container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

    {/* Left Content */}
    <div>
      <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
        Who We Are
      </span>

      <h2 className="mt-6 font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
        A Trusted Name in<br />Agricultural Exports
      </h2>

      <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
        Riva Agro Exports is an India-based agricultural export company
        committed to delivering premium-quality farm produce to
        international markets. We work closely with farmers, processors,
        and logistics partners to ensure reliability at every stage.
      </p>

      <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
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

<section className="py-24 bg-white">
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

{/* Why Choose Us – Alternate Design */}
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

    </>
  );
}