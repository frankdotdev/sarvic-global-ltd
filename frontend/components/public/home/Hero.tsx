'use client';

import Link from 'next/link';
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [trackingInput, setTrackingInput] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      router.push(`/track?id=${encodeURIComponent(trackingInput.trim().toUpperCase())}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1920"
          className="w-full h-full object-cover"
        >
          <source
            src="https://cdn.pixabay.com/video/2021/09/30/91864-621932480_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="container-main relative z-10 pt-32 pb-20 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          
          {/* Left: Main copy */}
          <div className="lg:col-span-7 animate-fade-up">
            <p className="eyebrow text-gold mb-6">Global Trade · Logistics · Manufacturing</p>
            <h1 className="font-display text-white text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[1.02] mb-8 text-balance">
              Connecting Global Trade Without Boundaries
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-10 font-light">
              Premium logistics, procurement, manufacturing, and supply chain solutions
              across Asia, Europe, and Africa — built on integrity, precision, and an
              unwavering commitment to your success.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/track" className="btn-primary bg-gold text-ink hover:bg-gold-dark py-4 px-7">
                Track Shipment
                <ArrowRight size={14} weight="bold" />
              </Link>
              <Link href="/contact#quote" className="btn-outline-gold text-white border-white/30 hover:border-gold hover:bg-transparent hover:text-gold py-4 px-7">
                Request Quote
              </Link>
            </div>

            {/* Quick track input */}
            <form onSubmit={handleTrack} className="mt-10 max-w-md">
              <div className="flex items-center bg-white/10 border border-white/20 backdrop-blur-sm">
                <MagnifyingGlass size={16} className="text-white/40 ml-4" />
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter tracking number — e.g. SVG-2606-8941"
                  className="flex-1 bg-transparent text-white text-sm px-3 py-4 outline-none placeholder:text-white/30 font-mono"
                />
                <button type="submit" className="bg-gold text-ink text-2xs tracking-wider uppercase px-5 py-4 hover:bg-gold-dark transition-colors shrink-0">
                  Track
                </button>
              </div>
            </form>
          </div>

          {/* Right: Live stats card */}
          <div className="lg:col-span-5 animate-fade-up delay-200">
            <div className="bg-white/[0.07] backdrop-blur-md border border-white/15 p-8 md:p-10">
              <p className="eyebrow text-gold/90 mb-8">Global Operations</p>
              <div className="grid grid-cols-2 gap-8">
                <Stat value="2020" label="Founded" />
                <Stat value="3" label="Countries" />
                <Stat value="4" label="Offices" />
                <Stat value="100+" label="Trade Routes" />
              </div>
              <div className="mt-8 pt-8 border-t border-white/15">
                <p className="text-2xs text-white/40 tracking-wider uppercase mb-2">Active Corridors</p>
                <p className="text-sm text-white/70 font-light">Guangzhou · Istanbul · Lagos · Alaba</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl md:text-4xl text-white font-light tracking-tight">{value}</p>
      <p className="text-2xs text-white/50 tracking-widest uppercase mt-1">{label}</p>
    </div>
  );
}
