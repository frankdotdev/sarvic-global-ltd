'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';
import { api, getErrorMessage } from '@/lib/api';
import { PublicTrackingResult } from '@/types';
import TrackingResult from './TrackingResult';

function TrackingPortalInner() {
  const searchParams = useSearchParams();
  const [trackingInput, setTrackingInput] = useState(searchParams.get('id') || '');
  const [result, setResult] = useState<PublicTrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (value: string) => {
    const trimmed = value.trim().toUpperCase();
    if (!trimmed) return;

    if (!/^SVG-\d{4}-\d{4}$/.test(trimmed)) {
      setError('Tracking number format should be SVG-XXXX-XXXX');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const { data } = await api.get(`/tracking/${trimmed}`);
      setResult(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      performSearch(idFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(trackingInput);
  };

  return (
    <div className="bg-navy min-h-[60vh]">
      {/* Search Header */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container-main">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="eyebrow text-gold mb-4">Shipment Tracking</p>
            <h1 className="font-display text-4xl md:text-5xl text-white font-light tracking-tighter mb-6">
              Track Your Shipment
            </h1>
            <p className="text-white/60 leading-relaxed">
              Enter your tracking number to view real-time status, current location,
              and complete shipment history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="flex-1 flex items-center bg-white/10 border border-white/20 px-4">
                <MagnifyingGlass size={18} className="text-white/40 shrink-0" />
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => { setTrackingInput(e.target.value); setError(''); }}
                  placeholder="SVG-2606-8941"
                  className="flex-1 bg-transparent text-white text-base px-3 py-4 outline-none placeholder:text-white/30 font-mono tracking-wider"
                  autoComplete="off"
                  autoCapitalize="characters"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary bg-gold text-ink hover:bg-gold-dark justify-center py-4 px-8 shrink-0 disabled:opacity-60"
              >
                {loading ? 'Searching…' : 'Track Now'}
                {!loading && <ArrowRight size={14} weight="bold" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-300 mt-3 text-center">{error}</p>}
          </form>
        </div>
      </section>

      {/* Results */}
      {hasSearched && (
        <section className="bg-paper">
          <div className="container-main py-16 md:py-20">
            {loading && (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-2 border-rule border-t-gold rounded-full animate-spin" />
                <p className="text-mist text-sm mt-4">Fetching shipment details…</p>
              </div>
            )}
            {!loading && error && !result && (
              <div className="max-w-md mx-auto text-center py-16">
                <p className="font-display text-2xl text-ink mb-3">Shipment Not Found</p>
                <p className="text-mist text-sm leading-relaxed">
                  We couldn&rsquo;t find a shipment with that tracking number. Please
                  double-check the number and try again, or contact our support team.
                </p>
              </div>
            )}
            {!loading && result && <TrackingResult result={result} />}
          </div>
        </section>
      )}
    </div>
  );
}

export default function TrackingPortal() {
  return (
    <Suspense fallback={<div className="bg-navy min-h-[60vh]" />}>
      <TrackingPortalInner />
    </Suspense>
  );
}
