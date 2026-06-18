import type { Metadata } from 'next';
import ContactForms from '@/components/public/shared/ContactForms';
import { Envelope, Phone, WhatsappLogo, Clock } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Sarvic Global Ltd. Request a quote, ask a question, or reach our offices in Guangzhou, Istanbul, or Lagos.',
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="container-main">
          <p className="eyebrow text-gold mb-4">Contact</p>
          <h1 className="font-display text-4xl md:text-6xl text-white font-light tracking-tighter max-w-3xl text-balance">
            Let&rsquo;s Talk About Your Trade Needs
          </h1>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <p className="eyebrow text-mist mb-5">Reach Us Directly</p>
                <div className="space-y-4">
                  <a href="mailto:sarvicglobaltd@gmail.com" className="flex items-center gap-3 text-sm text-steel hover:text-ink transition-colors">
                    <Envelope size={18} weight="light" className="text-gold shrink-0" />
                    sarvicglobaltd@gmail.com
                  </a>
                  <a href="tel:+8619566805494" className="flex items-center gap-3 text-sm text-steel hover:text-ink transition-colors">
                    <Phone size={18} weight="light" className="text-gold shrink-0" />
                    +86 195 6680 5494 (China)
                  </a>
                  <a href="tel:+905469904659" className="flex items-center gap-3 text-sm text-steel hover:text-ink transition-colors">
                    <Phone size={18} weight="light" className="text-gold shrink-0" />
                    +90 546 990 4659 (Turkey)
                  </a>
                  <a href="tel:+2347060866333" className="flex items-center gap-3 text-sm text-steel hover:text-ink transition-colors">
                    <WhatsappLogo size={18} weight="light" className="text-gold shrink-0" />
                    +234 706 086 6333 (Nigeria / WhatsApp)
                  </a>
                </div>
              </div>

              <div className="border-t border-rule pt-8">
                <p className="eyebrow text-mist mb-5">Business Hours</p>
                <div className="flex items-start gap-3">
                  <Clock size={18} weight="light" className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-steel">Monday – Saturday</p>
                    <p className="text-sm text-steel">9:00 AM – 6:00 PM (Local Time)</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-rule pt-8">
                <p className="eyebrow text-mist mb-5">Emergency Logistics Support</p>
                <p className="text-sm text-steel leading-relaxed">
                  For urgent shipment issues outside business hours, contact our
                  Nigeria office directly via WhatsApp for fastest response.
                </p>
              </div>
            </div>

            {/* Forms */}
            <div className="lg:col-span-2">
              <ContactForms />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
