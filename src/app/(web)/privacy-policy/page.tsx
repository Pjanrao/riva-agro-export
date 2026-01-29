export const metadata = {
  title: "Privacy Policy | Riva Agro Exports",
  description:
    "Privacy policy of Riva Agro Exports explaining how we collect, use, and protect personal data for export and import services.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 py-24">
      <div className="container max-w-4xl">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
            Legal Information
          </span>

          <h1 className="mt-6 font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Privacy Policy
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            Your privacy matters to us. This policy explains how we collect,
            use, and safeguard your information.
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-sm space-y-10">

          <p className="text-sm text-muted-foreground">
            <strong>Last updated:</strong> 31 December 2025
          </p>

          {/* Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              1. Introduction
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              At <strong>Riva Agro Exports</strong>, we are committed to protecting
              your personal information. This Privacy Policy outlines how we
              collect, use, and protect information when you visit our website
              or engage with our export–import services.
            </p>
          </div>

          {/* Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              2. Information We Collect
            </h2>

            <p className="mt-4 font-semibold text-gray-900">
              Personal Information:
            </p>
            <ul className="mt-2 list-disc ml-6 text-muted-foreground space-y-1">
              <li>Name and company name</li>
              <li>Email address and phone number</li>
              <li>Country and business address</li>
              <li>Product inquiries and communication details</li>
            </ul>

            <p className="mt-6 font-semibold text-gray-900">
              Non-Personal Information:
            </p>
            <ul className="mt-2 list-disc ml-6 text-muted-foreground space-y-1">
              <li>IP address and browser type</li>
              <li>Pages visited and time spent</li>
              <li>Device and usage analytics</li>
            </ul>
          </div>

          {/* Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              3. How We Use Your Information
            </h2>
            <ul className="mt-4 list-disc ml-6 text-muted-foreground space-y-2">
              <li>Responding to inquiries and quotations</li>
              <li>Providing export–import related services</li>
              <li>Improving website functionality and performance</li>
              <li>Complying with legal and regulatory obligations</li>
            </ul>
          </div>

          {/* Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              4. Cookies
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We may use cookies and similar technologies to enhance user
              experience and analyze website traffic. You can control cookie
              preferences through your browser settings.
            </p>
          </div>

          {/* Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              5. Data Sharing & Security
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We do not sell or rent personal data. Information may be shared
              only with trusted service providers or when required by law.
              Reasonable security measures are implemented to protect your data.
            </p>
          </div>

          {/* Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              6. International Data Transfers
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              As a global export business, your information may be processed
              across international borders with appropriate safeguards in place.
            </p>
          </div>

          {/* Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              7. Contact Us
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              If you have any questions regarding this Privacy Policy, please
              contact us:
            </p>

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
