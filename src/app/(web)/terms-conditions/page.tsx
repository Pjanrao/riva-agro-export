export const metadata = {
  title: "Terms & Conditions | Riva Agro Exports",
  description:
    "Terms and Conditions governing the use of Riva Agro Exports website and export services.",
};

export default function TermsConditionsPage() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 py-24">
      <div className="container max-w-4xl">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
            Legal Information
          </span>

          <h1 className="mt-6 font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Please read these terms carefully before using our website or
            engaging with our export services.
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-sm space-y-10">

          <p className="text-sm text-muted-foreground">
            <strong>Last updated:</strong> 31 December 2025
          </p>

          {/* 1 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              By accessing or using the Riva Agro Exports website, you agree to
              comply with and be bound by these Terms & Conditions. If you do not
              agree, please do not use this website.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              2. Business Nature
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Riva Agro Exports operates as an agricultural export company
              supplying farm-grown and sourced products to domestic and
              international buyers. Information provided on this website is for
              general reference only and does not constitute a binding offer.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              3. Product Information
            </h2>
            <ul className="mt-4 list-disc ml-6 text-muted-foreground space-y-2">
              <li>Product images are for reference and may vary naturally.</li>
              <li>Availability depends on season, quality, and production.</li>
              <li>Final specifications are confirmed during order approval.</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              4. Pricing & Quotations
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              All prices and quotations are subject to change based on quantity,
              grade, logistics, and destination. Pricing becomes binding only
              after official written confirmation.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              5. Orders & Payments
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Orders are processed only after mutual agreement on pricing,
              specifications, delivery terms, and payment conditions. Failure to
              comply with agreed payment terms may result in delays or
              cancellation.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              6. Shipping & Delivery
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Delivery timelines are estimated and may vary due to customs,
              weather conditions, logistics partners, or regulatory procedures.
              Riva Agro Exports is not responsible for delays beyond reasonable
              control.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              7. Quality Assurance
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              All products undergo strict quality checks prior to dispatch.
              Responsibility transfers as per agreed Incoterms once shipment is
              completed.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              8. Intellectual Property
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              All website content including text, images, logos, and branding is
              the intellectual property of Riva Agro Exports and may not be used
              without written permission.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              9. Limitation of Liability
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Riva Agro Exports shall not be liable for indirect, incidental, or
              consequential damages resulting from the use of this website or
              export services.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              10. Governing Law
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              These Terms & Conditions are governed by the laws of India. Any
              disputes shall be subject to the jurisdiction of Indian courts.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              11. Contact Information
            </h2>

            <div className="mt-4 rounded-2xl bg-primary/5 p-6">
              <p className="font-semibold text-gray-900">
                Riva Agro Exports
              </p>
             <p className="text-muted-foreground">
                Email: rivaagroexports@gmail.com <br />
                Phone: +91 9687725260  / +91 8000028181
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
