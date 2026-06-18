import type { Metadata } from 'next';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import ServicePageTemplate from '@/components/public/shared/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Global Procurement & Sourcing',
  description: 'End-to-end product sourcing, quality control, and supplier verification from major manufacturing hubs in China, handled by Sarvic Global Ltd.',
};

export default function ProcurementPage() {
  return (
    <ServicePageTemplate
      eyebrow="Procurement"
      title="Global Procurement & Sourcing"
      intro="We take the stress out of international trade. Our team handles end-to-end product sourcing, quality control, and supplier verification, ensuring you get the best products directly from major manufacturing hubs."
      heroImage="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1600"
      heroAlt="Factory production line"
      Icon={MagnifyingGlass}
      offerings={[
        { title: 'Supplier Verification', desc: 'On-the-ground vetting of manufacturers and suppliers, confirming legitimacy, capacity, and compliance before commitment.' },
        { title: 'Factory Sourcing', desc: 'Direct access to manufacturing hubs across Guangzhou and beyond, cutting out unnecessary middlemen.' },
        { title: 'Quality Inspection', desc: 'Pre-shipment inspection protocols verifying specifications, materials, and craftsmanship before goods leave the factory.' },
        { title: 'Price Negotiation', desc: 'Leveraging established supplier relationships to secure competitive pricing on your behalf.' },
        { title: 'Sample Coordination', desc: 'Arranging and verifying product samples prior to bulk order commitment.' },
        { title: 'Consolidation Services', desc: 'Combining multiple supplier orders into single shipments to reduce logistics costs.' },
      ]}
      faqs={[
        { q: 'How does Sarvic verify suppliers?', a: 'Our Guangzhou-based team conducts factory visits, checks business licenses, and reviews production history before recommending any supplier.' },
        { q: 'Can you source products I haven\'t found a supplier for yet?', a: 'Yes. Provide product specifications and target pricing, and our sourcing team will identify and vet suitable manufacturers.' },
        { q: 'Do you inspect goods before shipment?', a: 'Yes, quality inspection is a standard part of our procurement process to catch defects before goods are loaded for export.' },
      ]}
    />
  );
}
