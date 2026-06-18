'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

const COOKIE_KEY = 'sarvic_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    Cookies.set(COOKIE_KEY, 'accepted', { expires: 365 });
    setVisible(false);
  };

  const decline = () => {
    Cookies.set(COOKIE_KEY, 'declined', { expires: 30 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-white/10 text-white no-print">
      <div className="container-main py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs text-white/60 leading-relaxed max-w-xl">
          We use cookies to improve your experience on our site and to analyse traffic. By continuing to use our website, you agree to our{' '}
          <Link href="/cookies" className="text-gold hover:text-gold/80 underline underline-offset-2">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={decline} className="text-2xs text-white/40 hover:text-white/70 tracking-wider uppercase transition-colors">
            Decline
          </button>
          <button onClick={accept} className="btn-primary py-2.5 px-5 text-2xs bg-gold text-ink hover:bg-gold-dark">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
