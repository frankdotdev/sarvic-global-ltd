import type { Metadata } from 'next';
import Hero from '@/components/public/home/Hero';
import WhoWeAre from '@/components/public/home/WhoWeAre';
import ServicesGrid from '@/components/public/home/ServicesGrid';
import HowWeOperate from '@/components/public/home/HowWeOperate';
import TrackingSection from '@/components/public/home/TrackingSection';
import GlobalPresence from '@/components/public/home/GlobalPresence';
import WhyChoose from '@/components/public/home/WhyChoose';
import Testimonials from '@/components/public/home/Testimonials';
import CallToAction from '@/components/public/home/CallToAction';

export const metadata: Metadata = {
  title: 'Sarvic Global Ltd — Connecting Global Trade Without Boundaries',
  description:
    'Premium integrated logistics, procurement, manufacturing, and supply chain solutions across China, Turkey, and Nigeria. Track shipments, request quotes, and partner with Africa\'s most trusted global trade company.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <ServicesGrid />
      <HowWeOperate />
      <TrackingSection />
      <GlobalPresence />
      <WhyChoose />
      <Testimonials />
      <CallToAction />
    </>
  );
}
