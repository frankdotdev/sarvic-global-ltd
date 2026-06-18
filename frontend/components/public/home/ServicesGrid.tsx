import Link from 'next/link';
import {
  Airplane, Anchor, Train, Truck, MagnifyingGlass,
  Factory, Car, CurrencyDollar, ArrowUpRight,
} from '@phosphor-icons/react/dist/ssr';

const services = [
  {
    icon: Anchor,
    title: 'Integrated Logistics',
    href: '/services/logistics',
    items: ['Air Cargo', 'Ocean Freight', 'Rail Freight', 'Local Distribution'],
    image: 'https://images.pexels.com/photos/4319/cargo-ship.jpg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: MagnifyingGlass,
    title: 'Global Procurement',
    href: '/services/procurement',
    items: ['Supplier Verification', 'Factory Sourcing', 'Quality Inspection'],
    image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Factory,
    title: 'Manufacturing',
    href: '/services/manufacturing',
    items: ['Building Materials', 'Sanitary Ware', 'Apparel Production'],
    image: 'https://images.pexels.com/photos/3855962/pexels-photo-3855962.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Car,
    title: 'Automotive',
    href: '/services/automotive',
    items: ['Vehicle Procurement', 'Fleet Supply', 'Spare Parts'],
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: CurrencyDollar,
    title: 'Foreign Exchange',
    href: '/services/fx-services',
    items: ['International Payments', 'Trade Settlement', 'Cross-border Transactions'],
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function ServicesGrid() {
  return (
    <section className="section bg-white">
      <div className="container-main">
        <div className="max-w-2xl mb-16">
          <p className="eyebrow text-mist mb-4">Our Services</p>
          <h2 className="heading-section mb-6">
            One Partner. Every Stage<br />of Global Trade.
          </h2>
          <div className="rule-gold" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.href}
                href={service.href}
                className={`group bg-white p-8 md:p-10 transition-colors hover:bg-paper ${
                  idx === services.length - 1 ? 'lg:col-span-1' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-8">
                  <Icon size={28} weight="light" className="text-gold" />
                  <ArrowUpRight size={18} className="text-mist group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h3 className="heading-card mb-4">{service.title}</h3>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="text-sm text-mist flex items-center gap-2">
                      <span className="w-1 h-1 bg-gold rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Link>
            );
          })}

          {/* Closing CTA tile */}
          <div className="bg-navy p-8 md:p-10 flex flex-col justify-between">
            <div>
              <p className="text-2xs tracking-widest text-gold uppercase mb-3">End-to-End</p>
              <p className="font-display text-2xl text-white leading-snug">
                Every stage, one accountable partner.
              </p>
            </div>
            <Link href="/contact#quote" className="inline-flex items-center gap-2 text-2xs tracking-wider uppercase text-gold mt-6 group">
              Request a Quote
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
