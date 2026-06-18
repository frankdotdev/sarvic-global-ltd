import Image from 'next/image';
import { Target, Eye, Heart } from '@phosphor-icons/react/dist/ssr';

export default function WhoWeAre() {
  return (
    <section className="section bg-paper">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Sarvic Global warehouse and logistics operations"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-ink text-white p-6 hidden md:block max-w-[220px]">
              <p className="font-display text-3xl text-gold font-light">2020</p>
              <p className="text-2xs tracking-wider text-white/60 uppercase mt-1">Founded in Guangzhou</p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="eyebrow text-mist mb-4">Who We Are</p>
            <h2 className="heading-section mb-6">
              A Premier, Fully Integrated<br />Global Trade Conglomerate
            </h2>
            <div className="rule-gold mb-8" />
            <p className="text-steel leading-relaxed mb-6">
              Founded in January 2020, Sarvic Global Ltd was born out of a profound
              passion for delivering world-class service and a simple, powerful drive
              to bridge gaps in global trade. What started as a focused vision has
              evolved into a premier, fully integrated conglomerate spanning logistics,
              procurement, manufacturing, and supply chain solutions.
            </p>
            <p className="text-steel leading-relaxed mb-10">
              We connect businesses, markets, and people across borders, transforming
              complex global commerce into seamless, reliable experiences — with deep
              roots across Guangzhou, Istanbul, and Lagos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ValueCard
                icon={<Target size={22} weight="light" />}
                title="Mission"
                text="Premium quality service, connecting global markets with excellence and reliability."
              />
              <ValueCard
                icon={<Eye size={22} weight="light" />}
                title="Vision"
                text="The most trusted global partner in integrated trade and supply chain management."
              />
              <ValueCard
                icon={<Heart size={22} weight="light" />}
                title="Values"
                text="Integrity, precision, and human connection in every shipment we handle."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="border-l-2 border-gold pl-4">
      <div className="text-gold mb-3">{icon}</div>
      <p className="font-display text-lg text-ink mb-2">{title}</p>
      <p className="text-xs text-mist leading-relaxed">{text}</p>
    </div>
  );
}
