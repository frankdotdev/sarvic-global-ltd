import type { Metadata } from 'next';
import { CurrencyDollar } from '@phosphor-icons/react/dist/ssr';
import ServicePageTemplate from '@/components/public/shared/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Foreign Exchange (FX) Services',
  description: 'Secure, efficient foreign exchange and trade settlement solutions facilitating smooth cross-border transactions for Sarvic Global clients.',
};

export default function FxServicesPage() {
  return (
    <ServicePageTemplate
      eyebrow="FX Services"
      title="Foreign Exchange Services"
      intro="Navigating international payments shouldn't hold your business back. We provide secure, efficient, and reliable foreign exchange solutions to facilitate smooth, compliant cross-border transactions."
      heroImage="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1600"
      heroAlt="International trade and finance"
      Icon={CurrencyDollar}
      offerings={[
        { title: 'International Payments', desc: 'Facilitating secure cross-border payments to suppliers and manufacturing partners on your behalf.' },
        { title: 'Trade Settlement', desc: 'Managing settlement between buyers and sellers across currencies, reducing transaction friction.' },
        { title: 'Cross-Border Transactions', desc: 'Compliant handling of multi-currency transactions tied to your procurement and logistics activity.' },
        { title: 'Rate Transparency', desc: 'Clear, upfront exchange rate communication with no hidden settlement costs.' },
        { title: 'Multi-Currency Support', desc: 'Handling transactions across major trade currencies relevant to our China–Turkey–Nigeria corridors.' },
        { title: 'Compliance Handling', desc: 'Transactions structured to meet relevant regulatory and documentation requirements.' },
      ]}
      faqs={[
        { q: 'Which currencies does Sarvic Global support for trade settlement?', a: 'We support major trade currencies relevant to our China, Turkey, and Nigeria corridors, with rates communicated transparently before settlement.' },
        { q: 'Can FX services be combined with a procurement order?', a: 'Yes, FX settlement is commonly bundled with procurement and logistics services for a single, streamlined transaction.' },
        { q: 'Is there a minimum transaction size?', a: 'Minimums vary by transaction type and currency corridor — contact our team for specifics relevant to your trade volume.' },
      ]}
    />
  );
}
