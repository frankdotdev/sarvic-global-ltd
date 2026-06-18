'use client';

import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('@/components/public/shared/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] md:aspect-[2/1] bg-paper border border-rule flex items-center justify-center">
      <p className="text-mist text-sm">Loading map...</p>
    </div>
  ),
});

const offices = [
  { city: 'Guangzhou', country: 'China', lat: 23.1291, lng: 113.2644, role: 'Sourcing & Manufacturing Hub' },
  { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, role: 'European Trade Gateway' },
  { city: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, role: 'Head Office & Distribution' },
  { city: 'Alaba', country: 'Nigeria', lat: 6.4474, lng: 3.1965, role: 'International Market Office' },
];

export default function GlobalPresence() {
  return (
    <section className="section bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4">
            <p className="eyebrow text-mist mb-4">Global Presence</p>
            <h2 className="heading-section mb-6">
              Rooted Across Three Continents
            </h2>
            <div className="rule-gold mb-8" />
            <p className="text-steel leading-relaxed mb-8">
              With offices spanning China, Turkey, and Nigeria, we maintain
              direct operational control over every link in your supply chain —
              from factory floor to final delivery.
            </p>
            <div className="space-y-5">
              {offices.map((office) => (
                <div key={office.city} className="flex items-start gap-3 border-l-2 border-gold pl-4">
                  <div>
                    <p className="font-display text-lg text-ink">{office.city}, {office.country}</p>
                    <p className="text-xs text-mist">{office.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8">
            <WorldMap offices={offices} />
          </div>
        </div>
      </div>
    </section>
  );
}
