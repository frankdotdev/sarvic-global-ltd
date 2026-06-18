'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';

export default function TrackingSection() {
  const [trackingInput, setTrackingInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const value = trackingInput.trim().toUpperCase();
    if (!value) {
      setError('Please enter a tracking number.');
      return;
    }
    if (!/^SVG-\d{4}-\d{4}$/.test(value)) {
      setError('Format should be SVG-XXXX-XXXX');
      return;
    }
    setError('');
    router.push(`/track?id=${encodeURIComponent(value)}`);
  };

  return (
    <section className="section bg-navy relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)',
        }} />
      </div>

      <div className="container-main relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="eyebrow text-gold mb-4">Real-Time Visibility</p>
          <h2 className="font-display text-4xl md:text-5xl text-white font-light tracking-tighter mb-6">
            Track Your Shipment
          </h2>
          <p className="text-white/60 leading-relaxed">
            Enter your tracking number below to view live status, current location,
            and complete shipment history.
          </p>
        </div>

        <form onSubmit={handleTrack} className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="flex-1 flex items-center bg-white/10 border border-white/20 px-4">
              <MagnifyingGlass size={18} className="text-white/40 shrink-0" />
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => { setTrackingInput(e.target.value); setError(''); }}
                placeholder="SVG-2606-8941"
                className="flex-1 bg-transparent text-white text-base px-3 py-4 outline-none placeholder:text-white/30 font-mono tracking-wider"
              />
            </div>
            <button type="submit" className="btn-primary bg-gold text-ink hover:bg-gold-dark justify-center py-4 px-8 shrink-0">
              Track Now
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>
          {error && <p className="text-xs text-red-300 mt-3 text-center">{error}</p>}
          <p className="text-2xs text-white/30 text-center mt-4 tracking-wide">
            Tracking numbers follow the format SVG-DDMM-XXXX, sent to you via email or WhatsApp at booking.
          </p>
        </form>
      </div>
    </section>
  );
}
