import type { Metadata } from 'next';
import { Car } from '@phosphor-icons/react/dist/ssr';
import ServicePageTemplate from '@/components/public/shared/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Automotive Procurement & Spare Parts',
  description: 'Sarvic Global sources passenger vehicles, commercial trucks, fleet assets, and authentic spare parts across global automotive markets.',
};

export default function AutomotivePage() {
  return (
    <ServicePageTemplate
      eyebrow="Automotive"
      title="Automotive Procurement & Spare Parts"
      intro="We navigate the global automotive market to source and procure high-quality passenger vehicles, commercial trucks, and fleet assets. Alongside vehicle procurement, we supply authentic, reliable mechanical and body spare parts."
      heroImage="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1600"
      heroAlt="Vehicle fleet and automotive logistics"
      Icon={Car}
      offerings={[
        { title: 'Vehicle Procurement', desc: 'Sourcing passenger vehicles from verified global markets, matched to your specifications and budget.' },
        { title: 'Fleet Supply', desc: 'Bulk fleet acquisition for commercial operators, with logistics handled end-to-end.' },
        { title: 'Spare Parts Supply', desc: 'Authentic mechanical and body spare parts sourced directly from manufacturers, keeping industries moving.' },
        { title: 'Commercial Trucks', desc: 'Procurement of commercial-grade trucks for haulage, distribution, and industrial fleets.' },
        { title: 'Pre-Shipment Inspection', desc: 'Vehicle condition verification before export, reducing risk on every unit shipped.' },
        { title: 'Import Documentation', desc: 'Full handling of customs paperwork and compliance for vehicle imports.' },
      ]}
      faqs={[
        { q: 'Can you source specific vehicle makes and models?', a: 'Yes, provide your target make, model, and year, and our procurement team will identify available units in verified markets.' },
        { q: 'Do you supply spare parts in bulk for distributors?', a: 'Yes, we supply both retail-volume and bulk distributor orders for mechanical and body parts.' },
        { q: 'How are vehicles inspected before shipment?', a: 'Each vehicle undergoes a pre-shipment condition check covering mechanical function, body integrity, and documentation accuracy.' },
      ]}
    />
  );
}
