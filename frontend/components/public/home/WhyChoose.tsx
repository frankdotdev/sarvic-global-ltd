import { ArrowsLeftRight, GlobeHemisphereWest, Factory, HandHeart } from '@phosphor-icons/react/dist/ssr';

const reasons = [
  {
    icon: ArrowsLeftRight,
    title: 'End-to-End Integration',
    desc: 'From the factory floor to international shipping, we manage every step. No middlemen, no third-party friction.',
  },
  {
    icon: GlobeHemisphereWest,
    title: 'Global Reach',
    desc: 'Deep roots across China, Turkey, and Nigeria — precise technical insight into complex global trade corridors.',
  },
  {
    icon: Factory,
    title: 'Manufacturing Expertise',
    desc: 'Direct involvement in production and sourcing means uncompromising quality control at every stage.',
  },
  {
    icon: HandHeart,
    title: 'Customer Satisfaction',
    desc: 'Every shipment we track, vehicle we inspect, or material we produce is handled with dedication to your success.',
  },
];

export default function WhyChoose() {
  return (
    <section className="section bg-paper">
      <div className="container-main">
        <div className="max-w-2xl mb-16">
          <p className="eyebrow text-mist mb-4">Why Choose Sarvic</p>
          <h2 className="heading-section mb-6">
            Built on Integration,<br />Proven by Results
          </h2>
          <div className="rule-gold" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div key={reason.title} className="bg-white p-8">
                <Icon size={26} weight="light" className="text-gold mb-6" />
                <h3 className="font-display text-xl text-ink mb-3">{reason.title}</h3>
                <p className="text-sm text-mist leading-relaxed">{reason.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
