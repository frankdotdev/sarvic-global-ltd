import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import type { Icon } from '@phosphor-icons/react';

interface ServicePageProps {
  eyebrow: string;
  title: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  Icon: Icon;
  offerings: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export default function ServicePageTemplate({
  eyebrow, title, intro, heroImage, heroAlt, Icon, offerings, faqs,
}: ServicePageProps) {
  return (
    <>
      <section className="bg-navy pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-gold mb-4">{eyebrow}</p>
              <h1 className="font-display text-4xl md:text-6xl text-white font-light tracking-tighter mb-6 text-balance">
                {title}
              </h1>
              <p className="text-white/60 leading-relaxed max-w-xl">{intro}</p>
            </div>
            <div className="lg:col-span-5">
              <Icon size={48} weight="light" className="text-gold ml-auto hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-main">
          <div className="relative aspect-[16/7] -mt-1 overflow-hidden">
            <Image src={heroImage} alt={heroAlt} fill className="object-cover" priority />
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-main">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow text-mist mb-4">What We Offer</p>
            <h2 className="heading-section mb-6">Comprehensive Capability</h2>
            <div className="rule-gold" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule">
            {offerings.map((item) => (
              <div key={item.title} className="bg-white p-8">
                <CheckCircle size={22} weight="light" className="text-gold mb-5" />
                <h3 className="font-display text-xl text-ink mb-3">{item.title}</h3>
                <p className="text-sm text-mist leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-main max-w-3xl">
          <div className="mb-12">
            <p className="eyebrow text-mist mb-4">Frequently Asked</p>
            <h2 className="heading-section mb-6">Common Questions</h2>
            <div className="rule-gold" />
          </div>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-rule pb-8 last:border-0">
                <p className="font-display text-lg text-ink mb-2">{faq.q}</p>
                <p className="text-sm text-mist leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="container-main text-center max-w-xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-white font-light mb-6 text-balance">
            Ready to discuss your {title.toLowerCase()} needs?
          </h2>
          <Link href="/contact#quote" className="btn-primary bg-gold text-ink hover:bg-gold-dark py-4 px-8 inline-flex">
            Request a Quote
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </section>
    </>
  );
}
