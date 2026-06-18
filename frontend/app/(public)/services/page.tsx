import type { Metadata } from 'next';
import Link from 'next/link';
import { Anchor, MagnifyingGlass, Factory, Car, CurrencyDollar, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore Sarvic Global Ltd\'s integrated services: logistics, procurement, manufacturing, automotive, and foreign exchange — all under one accountable partner.',
};

const services = [
  { icon: Anchor, title: 'Integrated Logistics', href: '/services/logistics', desc: 'Air, ocean, rail freight and local distribution.' },
  { icon: MagnifyingGlass, title: 'Global Procurement', href: '/services/procurement', desc: 'Supplier verification, sourcing, and quality inspection.' },
  { icon: Factory, title: 'Manufacturing', href: '/services/manufacturing', desc: 'Building materials, sanitary ware, and apparel production.' },
  { icon: Car, title: 'Automotive', href: '/services/automotive', desc: 'Vehicle procurement, fleet supply, and spare parts.' },
  { icon: CurrencyDollar, title: 'Foreign Exchange', href: '/services/fx-services', desc: 'International payments and trade settlement.' },
];

export default function ServicesIndexPage() {
  return (
    <>
      <section className="bg-navy pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="container-main">
          <p className="eyebrow text-gold mb-4">What We Do</p>
          <h1 className="font-display text-4xl md:text-6xl text-white font-light tracking-tighter max-w-3xl text-balance">
            One Partner, Every Stage of Global Trade
          </h1>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.href} href={service.href} className="group bg-white p-10 hover:bg-paper transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <Icon size={32} weight="light" className="text-gold" />
                    <ArrowUpRight size={18} className="text-mist group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h2 className="heading-card mb-3">{service.title}</h2>
                  <p className="text-sm text-mist">{service.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
