import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Sarvic Global Ltd terms of service governing use of our website and logistics, procurement, and manufacturing services.',
};

export default function TermsPage() {
  return (
    <section className="pt-32 md:pt-44 pb-24 bg-paper">
      <div className="container-main max-w-3xl">
        <p className="eyebrow text-mist mb-4">Legal</p>
        <h1 className="heading-section mb-3">Terms of Service</h1>
        <p className="text-xs text-mist mb-12">Last updated: June 2026</p>

        <div className="space-y-10 text-sm text-steel leading-relaxed">
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Sarvic Global Ltd website and services, you agree
              to be bound by these Terms of Service. If you do not agree to these terms,
              please do not use our website or services.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">2. Services Provided</h2>
            <p>
              Sarvic Global Ltd, operating as Guangzhou Sarvic Global Trading Co., Ltd,
              provides integrated logistics, procurement, manufacturing, automotive
              sourcing, and foreign exchange services. Specific terms for each shipment
              or order are governed by individual service agreements between Sarvic
              Global and the client.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">3. Tracking Information</h2>
            <p>
              Tracking numbers and shipment statuses provided through our website reflect
              the most current information available at the time of update. While we
              strive for accuracy, transit times and statuses are estimates and may be
              subject to change due to customs processing, weather, or carrier delays.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">4. Quotes & Pricing</h2>
            <p>
              Quotes provided through our website or contact forms are estimates only
              and are subject to confirmation following review of full shipment or order
              details. Final pricing will be communicated directly by our team.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">5. Limitation of Liability</h2>
            <p>
              Sarvic Global Ltd shall not be liable for indirect, incidental, or
              consequential damages arising from the use of our website or services,
              except as required by applicable law or as specified in individual
              service agreements.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">6. Governing Law</h2>
            <p>
              These terms are governed by the laws applicable in the jurisdictions
              where Sarvic Global Ltd operates, including China and Nigeria, as
              relevant to the specific service engaged.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">7. Contact</h2>
            <p>
              For questions about these Terms of Service, contact us at
              sarvicglobaltd@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
