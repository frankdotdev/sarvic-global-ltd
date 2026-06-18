import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Sarvic Global Ltd uses cookies on our website.',
};

export default function CookiesPage() {
  return (
    <section className="pt-32 md:pt-44 pb-24 bg-paper">
      <div className="container-main max-w-3xl">
        <p className="eyebrow text-mist mb-4">Legal</p>
        <h1 className="heading-section mb-3">Cookie Policy</h1>
        <p className="text-xs text-mist mb-12">Last updated: June 2026</p>

        <div className="space-y-10 text-sm text-steel leading-relaxed">
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit our
              website. They help us provide a better browsing experience and understand
              how our site is used.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">Cookies We Use</h2>
            <p className="mb-4">
              <strong className="text-ink">Essential Cookies:</strong> Required for core
              website functionality, including remembering your cookie consent preference
              and maintaining admin session security.
            </p>
            <p className="mb-4">
              <strong className="text-ink">Preference Cookies:</strong> Used by Google
              Translate to remember your selected language across pages.
            </p>
            <p>
              <strong className="text-ink">Analytics Cookies:</strong> Help us understand
              how visitors use our website so we can improve content and navigation.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">Managing Cookies</h2>
            <p>
              You can control or delete cookies through your browser settings. Disabling
              cookies may affect certain website features, including language preference
              persistence and admin functionality.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">Contact</h2>
            <p>
              Questions about our Cookie Policy can be directed to sarvicglobaltd@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
