import type { Metadata } from 'next';
import TrackingPortal from '@/components/public/tracking/TrackingPortal';

export const metadata: Metadata = {
  title: 'Track Your Shipment',
  description: 'Track your Sarvic Global shipment in real time. Enter your tracking number to view status, location, and full history.',
  alternates: { canonical: 'https://sarvicglobal.com/track' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I track my Sarvic Global shipment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter your tracking number, formatted as SVG-DDMM-XXXX, into the tracking box on this page. You will see live status, current location, and full shipment history.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where do I find my Sarvic Global tracking number?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your tracking number is sent automatically via email or WhatsApp when your shipment is booked with Sarvic Global Ltd.',
      },
    },
    {
      '@type': 'Question',
      name: 'What do the shipment statuses mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shipments move through six stages: Received at Warehouse, Loading and Consolidation, In Transit, Customs Clearing, Ready for Pickup, and Delivered.',
      },
    },
  ],
};

export default function TrackPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <TrackingPortal />
    </>
  );
}
