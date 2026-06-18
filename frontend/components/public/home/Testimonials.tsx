'use client';

import { useState } from 'react';
import { Quotes, CaretLeft, CaretRight } from '@phosphor-icons/react';

const testimonials = [
  {
    quote: 'Sarvic Global handled our entire building materials shipment from Guangzhou to Lagos without a single delay. The tracking portal kept us informed every step of the way.',
    name: 'Emeka Okafor',
    role: 'Director, Okafor Building Supplies',
  },
  {
    quote: 'We have worked with several freight forwarders before, but none matched the level of integration Sarvic provides — sourcing, quality inspection, and shipping all under one roof.',
    name: 'Adaeze Nwosu',
    role: 'Founder, Nwosu Interiors Ltd',
  },
  {
    quote: 'Their automotive procurement team sourced exactly what we needed at a fair price, and customs clearance in Istanbul was seamless.',
    name: 'Mohammed Al-Rashid',
    role: 'Operations Lead, Rashid Trading Co',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[index];

  return (
    <section className="section bg-white">
      <div className="container-main">
        <div className="max-w-3xl mx-auto text-center">
          <Quotes size={36} weight="light" className="text-gold mx-auto mb-8" />
          <p className="font-display text-2xl md:text-3xl text-ink leading-snug mb-10 text-balance">
            &ldquo;{t.quote}&rdquo;
          </p>
          <p className="font-sans text-sm text-ink font-medium">{t.name}</p>
          <p className="text-xs text-mist mt-1">{t.role}</p>

          <div className="flex items-center justify-center gap-6 mt-10">
            <button onClick={prev} aria-label="Previous testimonial" className="p-2 border border-rule hover:border-ink transition-colors">
              <CaretLeft size={16} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-gold' : 'bg-rule'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} aria-label="Next testimonial" className="p-2 border border-rule hover:border-ink transition-colors">
              <CaretRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
