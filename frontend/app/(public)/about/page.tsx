import type { Metadata } from 'next';
import Image from 'next/image';
import { Target, Eye, ArrowsLeftRight, GlobeHemisphereWest } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Founded in January 2020, Sarvic Global Ltd is a premier integrated conglomerate spanning logistics, procurement, manufacturing, and supply chain solutions across China, Turkey, and Nigeria.',
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-navy pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="container-main">
          <p className="eyebrow text-gold mb-4">About Sarvic Global</p>
          <h1 className="font-display text-4xl md:text-6xl text-white font-light tracking-tighter max-w-3xl text-balance">
            Bridging Gaps in Global Trade Since 2020
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-paper">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-32">
              <Image
                src="https://images.pexels.com/photos/3057960/pexels-photo-3057960.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Sarvic Global manufacturing facility"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow text-mist mb-4">Our Story</p>
              <h2 className="heading-section mb-6">From a Focused Vision<br />to a Global Conglomerate</h2>
              <div className="rule-gold mb-8" />
              <p className="text-steel leading-relaxed mb-5">
                Operating as Guangzhou Sarvic Global Trading Co., Ltd, Sarvic Global Ltd was
                founded in January 2020 out of a profound passion for delivering world-class
                service and a simple, powerful drive to bridge gaps in global trade.
              </p>
              <p className="text-steel leading-relaxed mb-5">
                What started as a focused vision has evolved into a premier, fully integrated
                conglomerate spanning logistics, procurement, manufacturing, and supply chain
                solutions. We connect businesses, markets, and people across borders,
                transforming complex global commerce into seamless, reliable experiences.
              </p>
              <p className="text-steel leading-relaxed mb-10">
                Today, our footprint spans Guangzhou, Istanbul, and Lagos — giving us direct
                operational control over sourcing, manufacturing, logistics, and customs
                clearance, without relying on third parties.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border-l-2 border-gold pl-5">
                  <Target size={22} weight="light" className="text-gold mb-3" />
                  <p className="font-display text-xl text-ink mb-2">Our Mission</p>
                  <p className="text-sm text-mist leading-relaxed">
                    To deliver premium quality services without compromise, seamlessly
                    connecting global markets while putting smiles on our clients&rsquo;
                    faces through excellence, reliability, and dedication.
                  </p>
                </div>
                <div className="border-l-2 border-gold pl-5">
                  <Eye size={22} weight="light" className="text-gold mb-3" />
                  <p className="font-display text-xl text-ink mb-2">Our Vision</p>
                  <p className="text-sm text-mist leading-relaxed">
                    To be the most trusted global partner in integrated trade, logistics,
                    manufacturing, and supply chain management — recognized for operational
                    efficiency and human connection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="max-w-2xl mb-16">
            <p className="eyebrow text-mist mb-4">Expanded Capabilities</p>
            <h2 className="heading-section mb-6">A Multi-Faceted Enterprise</h2>
            <div className="rule-gold" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Integrated Logistics Solutions', desc: 'Time-sensitive air cargo, cost-effective ocean freight, dependable rail transport, and efficient local distribution — ensuring goods reach their destination safely and on schedule.' },
              { title: 'Building Materials & Sanitary Ware', desc: 'Active manufacturing and supply of premium structural and finishing products, from heavy-duty building materials to modern, high-end sanitary ware.' },
              { title: 'Automotive Procurement & Spare Parts', desc: 'Navigating the global automotive market to source passenger vehicles, commercial trucks, fleet assets, and authentic mechanical and body spare parts.' },
              { title: 'Global Procurement & Sourcing', desc: 'End-to-end product sourcing, quality control, and supplier verification — ensuring you get the best products directly from major manufacturing hubs.' },
              { title: 'Apparel & Clothing Manufacturing', desc: 'Dedicated manufacturing streams for high-quality clothing and apparel, combining premium materials with efficient production.' },
              { title: 'Foreign Exchange Services', desc: 'Secure, efficient, and reliable foreign exchange solutions facilitating smooth, compliant cross-border transactions.' },
            ].map((cap) => (
              <div key={cap.title} className="border border-rule p-7">
                <h3 className="font-display text-xl text-ink mb-3">{cap.title}</h3>
                <p className="text-sm text-mist leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="section bg-paper">
        <div className="container-main">
          <div className="max-w-2xl mb-16">
            <p className="eyebrow text-mist mb-4">Leadership</p>
            <h2 className="heading-section mb-6">Founded on Vision and Partnership</h2>
            <div className="rule-gold" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-rule">
                <Image
                  src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Engr. Victor Uchechukwu Dike, Founder and CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-display text-2xl text-ink mb-1">Engr. Victor Uchechukwu Dike</p>
              <p className="text-2xs tracking-widest text-gold uppercase mb-4">Founder & CEO</p>
              <p className="text-sm text-mist leading-relaxed">
                Victor founded Sarvic Global Ltd in January 2020 with a vision to integrate
                logistics, sourcing, and manufacturing into one seamless trade ecosystem
                connecting Asia, Europe, and Africa.
              </p>
            </div>
            <div>
              <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-rule">
                <Image
                  src="https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Mrs Sarah Oluchi Dike, Co-Founder"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-display text-2xl text-ink mb-1">Mrs Sarah Oluchi Dike</p>
              <p className="text-2xs tracking-widest text-gold uppercase mb-4">Co-Founder</p>
              <p className="text-sm text-mist leading-relaxed">
                Sarah brings operational discipline and client-first values to Sarvic Global,
                helping shape the company&rsquo;s customer-centric philosophy across every office.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule max-w-4xl mx-auto">
            <div className="bg-white p-8">
              <ArrowsLeftRight size={26} weight="light" className="text-gold mb-5" />
              <p className="font-display text-xl text-ink mb-3">True End-to-End Integration</p>
              <p className="text-sm text-mist leading-relaxed">
                From the factory floor and production lines to automotive sourcing and
                international shipping, we manage every single step — eliminating
                third-party friction and guaranteeing quality control.
              </p>
            </div>
            <div className="bg-white p-8">
              <GlobeHemisphereWest size={26} weight="light" className="text-gold mb-5" />
              <p className="font-display text-xl text-ink mb-3">Global Reach, Industrial Expertise</p>
              <p className="text-sm text-mist leading-relaxed">
                Deep roots in major international manufacturing and transport corridors
                give us the precise technical insight and logistics network required to
                navigate complex global trade effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
