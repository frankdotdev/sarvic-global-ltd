import type { Metadata } from 'next';
import { Factory } from '@phosphor-icons/react/dist/ssr';
import ServicePageTemplate from '@/components/public/shared/ServicePageTemplate';

export const metadata: Metadata = {
  title: 'Manufacturing — Building Materials, Sanitary Ware & Apparel',
  description: 'Sarvic Global manufactures and supplies premium building materials, sanitary ware, and apparel with top-tier craftsmanship and contemporary design.',
};

export default function ManufacturingPage() {
  return (
    <ServicePageTemplate
      eyebrow="Manufacturing"
      title="Building Materials, Sanitary Ware & Apparel"
      intro="We are actively involved in the manufacturing and supply of premium structural and finishing products, plus dedicated apparel production — combining premium materials with efficient production to bring concepts to life."
      heroImage="https://images.pexels.com/photos/3855962/pexels-photo-3855962.jpeg?auto=compress&cs=tinysrgb&w=1600"
      heroAlt="Manufacturing production line"
      Icon={Factory}
      offerings={[
        { title: 'Building Materials', desc: 'Heavy-duty structural products manufactured and supplied to durability standards for residential and commercial projects.' },
        { title: 'Sanitary Ware', desc: 'Modern, high-end sanitary fittings combining contemporary design with reliable craftsmanship.' },
        { title: 'Apparel Production', desc: 'Dedicated clothing and textile manufacturing streams from fabric sourcing through finished garment.' },
        { title: 'Custom Specifications', desc: 'Production runs tailored to client-specified dimensions, materials, and finishes.' },
        { title: 'Quality Assurance', desc: 'In-house inspection at every production stage, from raw material to finished product.' },
        { title: 'Bulk & Project Orders', desc: 'Scalable production capacity supporting both retail-volume and large infrastructure project orders.' },
      ]}
      faqs={[
        { q: 'Can Sarvic Global manufacture custom building materials to specification?', a: 'Yes, our manufacturing partners accommodate custom dimensions, finishes, and material specifications for residential and commercial projects.' },
        { q: 'What apparel categories do you produce?', a: 'We operate manufacturing streams for general clothing and textile concepts, with capacity scaling to bulk and project-level orders.' },
        { q: 'Is sanitary ware production export-ready?', a: 'Yes, all sanitary ware production is paired with our logistics arm for direct export and delivery to your destination market.' },
      ]}
    />
  );
}
