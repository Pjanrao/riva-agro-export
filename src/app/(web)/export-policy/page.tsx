export const metadata = {
  title: "Export Policy | Riva Agro Exports",
  description:
    "Export policy of Riva Agro Exports outlining procedures, quality standards, compliance, and international shipping guidelines.",
};

export default function ExportPolicyPage() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 py-24">
      <div className="container max-w-4xl">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
            Trade Information
          </span>

          <h1 className="mt-6 font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Export Policy
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Our export policy defines quality standards, compliance,
            and procedures followed for global shipments.
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
              1. Export Scope
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Riva Agro Exports specializes in the export of agricultural and
              farm-based products sourced directly from growers and approved
              suppliers. All exports are conducted in compliance with
              international trade regulations and destination country
              requirements.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              2. Quality Standards
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every shipment undergoes strict quality checks, grading, and
              packaging to ensure products meet export-grade standards.
              Natural variations in agricultural products are accepted within
              agreed quality tolerances.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              3. Documentation & Compliance
            </h2>
            <ul className="mt-4 list-disc ml-6 text-muted-foreground space-y-2">
              <li>Export invoices and packing lists</li>
              <li>Phytosanitary and quality certificates (where applicable)</li>
              <li>Country-specific regulatory documents</li>
              <li>Compliance with Indian export laws and customs regulations</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              4. Shipping & Logistics
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Shipping timelines are estimated and depend on logistics partners,
              customs clearance, weather conditions, and destination port
              regulations. Riva Agro Exports ensures secure packaging and proper
              handling until shipment handover as per agreed Incoterms.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              5. Risk & Responsibility
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Risk and responsibility for goods transfer according to agreed
              trade terms. Riva Agro Exports is not liable for delays or losses
              caused by factors beyond reasonable control, including customs
              delays, port congestion, or force majeure events.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              6. Policy Updates
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This Export Policy may be updated periodically to reflect changes
              in regulations or business practices. Updates will be published
              on this page.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              7. Contact Information
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
