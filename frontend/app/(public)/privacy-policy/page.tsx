import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Sarvic Global Ltd privacy policy — how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-32 md:pt-44 pb-24 bg-paper">
      <div className="container-main max-w-3xl">
        <p className="eyebrow text-mist mb-4">Legal</p>
        <h1 className="heading-section mb-3">Privacy Policy</h1>
        <p className="text-xs text-mist mb-12">Last updated: June 2026</p>

        <div className="space-y-10 text-sm text-steel leading-relaxed">
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">1. Information We Collect</h2>
            <p>
              Sarvic Global Ltd ("we," "our," or "us") collects information you provide
              directly to us, including your name, email address, phone number, company
              name, and shipment details when you request a quote, submit a contact form,
              or use our tracking system. We also collect technical information such as
              IP address and browser type for security and analytics purposes.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">2. How We Use Your Information</h2>
            <p>
              We use collected information to process shipments, provide quotes, send
              status notifications via email, SMS, or WhatsApp, respond to inquiries,
              and improve our services. We do not sell your personal information to
              third parties.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">3. Information Sharing</h2>
            <p>
              We may share your information with logistics partners, customs authorities,
              and notification service providers (such as email, SMS, and WhatsApp
              providers) strictly to facilitate shipment processing and communication.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">4. Data Security</h2>
            <p>
              We implement industry-standard security measures, including encrypted data
              transmission and access controls, to protect your information against
              unauthorized access, alteration, or disclosure.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">5. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. See our{' '}
              <a href="/cookies" className="text-gold hover:text-gold-dark underline underline-offset-2">Cookie Policy</a>{' '}
              for full details on the cookies we use and how to manage your preferences.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">6. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal
              information by contacting us at sarvicglobaltd@gmail.com.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">7. Contact Us</h2>
            <p>
              For questions regarding this Privacy Policy, contact us at
              sarvicglobaltd@gmail.com or visit any of our global offices listed on
              our Offices page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
