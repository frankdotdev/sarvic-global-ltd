import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

export default function CallToAction() {
  return (
    <section className="relative bg-navy py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Cargo aircraft on tarmac"
          fill
          className="object-cover"
        />
      </div>
      <div className="container-main relative z-10 text-center max-w-2xl mx-auto">
        <p className="eyebrow text-gold mb-5">Let&rsquo;s Work Together</p>
        <h2 className="font-display text-4xl md:text-5xl text-white font-light tracking-tighter mb-8 text-balance">
          Ready to Move Your Business Forward?
        </h2>
        <p className="text-white/60 leading-relaxed mb-10">
          Whether you need logistics, sourcing, manufacturing, or trade finance —
          our team is ready to build a solution around your goals.
        </p>
        <Link href="/contact#quote" className="btn-primary bg-gold text-ink hover:bg-gold-dark py-4 px-8 inline-flex">
          Request a Quote Today
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
