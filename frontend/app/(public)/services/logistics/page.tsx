import type { Metadata } from 'next';
import { Anchor } from '@phosphor-icons/react/dist/ssr';
import ServicePageTemplate from '@/components/public/shared/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Integrated Logistics Solutions',
  description: 'Air cargo, ocean freight, rail freight, and local distribution — Sarvic Global moves your goods safely and on schedule across China, Turkey, and Nigeria.',
};

export default function LogisticsPage() {
  return (
    <ServicePageTemplate
      eyebrow="Logistics"
      title="Integrated Logistics Solutions"
      intro="We move the world for you. Whether it's time-sensitive air cargo, cost-effective ocean freight, dependable railway transport, or efficient local distribution, we ensure your goods reach their destination safely and on schedule."
      heroImage="https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1600"
      heroAlt="Container ship at port"
      Icon={Anchor}
      offerings={[
        { title: 'Air Cargo', desc: 'Time-sensitive freight moved via major air corridors, ideal for high-value or perishable goods requiring fast transit.' },
        { title: 'Ocean Freight', desc: 'Cost-effective FCL and LCL container shipping across our established Guangzhou–Lagos–Istanbul corridors.' },
        { title: 'Rail Freight', desc: 'Reliable overland transport connecting key inland hubs, balancing cost efficiency with transit speed.' },
        { title: 'Local Distribution', desc: 'Last-mile delivery and local transportation ensuring goods reach warehouses, retailers, or end clients.' },
        { title: 'Customs Clearance', desc: 'Full documentation handling and compliance management at every border crossing.' },
        { title: 'Real-Time Tracking', desc: 'Every shipment is logged into our tracking system, giving you visibility from booking to delivery.' },
      ]}
      faqs={[
        { q: 'How long does ocean freight take from Guangzhou to Lagos?', a: 'Transit times typically range from 30 to 45 days depending on vessel schedules, transshipment ports, and customs processing at destination.' },
        { q: 'Can Sarvic Global handle both FCL and LCL shipments?', a: 'Yes. We manage full container load and less-than-container load shipments, consolidating smaller cargo to optimize cost.' },
        { q: 'Do you provide door-to-door delivery?', a: 'Yes, our local distribution network extends pickup and delivery service from origin warehouse to final destination.' },
      ]}
    />
  );
}
