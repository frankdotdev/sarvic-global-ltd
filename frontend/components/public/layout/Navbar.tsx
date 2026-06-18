'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { List, X, CaretDown, Globe, Phone } from '@phosphor-icons/react';
import { clsx } from 'clsx';

const services = [
  { label: 'Integrated Logistics', href: '/services/logistics' },
  { label: 'Global Procurement', href: '/services/procurement' },
  { label: 'Manufacturing', href: '/services/manufacturing' },
  { label: 'Automotive', href: '/services/automotive' },
  { label: 'FX Services', href: '/services/fx-services' },
];

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services', dropdown: services },
  { label: 'Track Shipment', href: '/track' },
  { label: 'Offices', href: '/offices' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navBg = scrolled || !isHome
    ? 'bg-navy border-b border-navy-light shadow-heavy'
    : 'bg-transparent border-b border-white/10';

  return (
    <>
      {/* Top Bar */}
      <div className="bg-ink border-b border-white/10 hidden md:block">
        <div className="container-main flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <a href="mailto:sarvicglobaltd@gmail.com" className="flex items-center gap-1.5 text-2xs text-mist hover:text-white transition-colors tracking-wider">
              <span>sarvicglobaltd@gmail.com</span>
            </a>
            <span className="text-white/10">|</span>
            <a href="tel:+8619566805494" className="flex items-center gap-1.5 text-2xs text-mist hover:text-white transition-colors tracking-wider">
              <Phone size={10} weight="light" />
              <span>+86 195 6680 5494</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div id="google_translate_element" className="text-2xs" />
            <Globe size={12} className="text-mist" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={clsx('fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:top-9', navBg)}>
        <div className="container-main flex items-center justify-between h-16 md:h-18">
          
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-display text-xl text-white tracking-tighter font-light group-hover:text-gold transition-colors">
              Sarvic Global
            </span>
            <span className="text-2xs tracking-widest text-gold/80 uppercase font-sans font-medium" style={{ letterSpacing: '0.2em' }}>
              Ltd
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className={clsx(
                      'flex items-center gap-1 text-2xs tracking-wider uppercase font-sans transition-colors',
                      servicesOpen ? 'text-gold' : 'text-white/80 hover:text-white'
                    )}
                  >
                    {link.label}
                    <CaretDown
                      size={10}
                      weight="bold"
                      className={clsx('transition-transform duration-200', servicesOpen && 'rotate-180')}
                    />
                  </button>
                  {servicesOpen && (
                    <div className="absolute top-full left-0 mt-3 w-56 bg-ink border border-white/10 shadow-heavy py-2 z-50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-5 py-3 text-2xs tracking-wider text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'text-2xs tracking-wider uppercase font-sans transition-colors',
                    pathname === link.href ? 'text-gold' : 'text-white/80 hover:text-white',
                    link.href === '/track' && 'text-gold/90 hover:text-gold'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/contact#quote" className="btn-outline-gold text-white border-gold/50 hover:border-gold py-2.5 px-5 text-2xs">
              Request Quote
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-navy border-t border-white/10 max-h-screen overflow-y-auto">
            <div className="py-4 px-4">
              {/* Mobile translate */}
              <div className="flex items-center gap-2 pb-4 border-b border-white/10 mb-4">
                <Globe size={14} className="text-mist" />
                <div id="google_translate_element_mobile" />
              </div>

              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.href}>
                    <div className="text-2xs tracking-wider text-gold uppercase py-3 border-b border-white/10">
                      {link.label}
                    </div>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-2xs tracking-wider text-white/70 hover:text-white uppercase py-3 pl-4 border-b border-white/5 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      'block text-2xs tracking-wider uppercase py-3 border-b border-white/10 transition-colors',
                      pathname === link.href ? 'text-gold' : 'text-white/80 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-4">
                <Link href="/contact#quote" className="btn-primary w-full justify-center py-3">
                  Request a Quote
                </Link>
              </div>
              <div className="pt-4 space-y-2">
                <a href="tel:+8619566805494" className="block text-2xs text-mist tracking-wider">+86 195 6680 5494</a>
                <a href="tel:+905469904659" className="block text-2xs text-mist tracking-wider">+90 546 990 4659</a>
                <a href="tel:+2347060866333" className="block text-2xs text-mist tracking-wider">+234 706 086 6333</a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
