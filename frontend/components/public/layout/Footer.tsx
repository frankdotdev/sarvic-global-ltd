import Link from 'next/link';
import { MapPin, Envelope, Phone } from '@phosphor-icons/react/dist/ssr';

const offices = [
  {
    city: 'Guangzhou, China',
    address: 'Floor 4, District D, Lot D113, Guota International Trade City, 27 Guangyuan West Road, Yuexiu District',
    phone: '+86 195 6680 5494',
  },
  {
    city: 'Turkey',
    address: 'Namik Kamal Caddesi Isi Markezi No 25, Kat 3/Kapi 21',
    phone: '+90 546 990 4659',
  },
  {
    city: 'Lagos, Nigeria',
    address: 'Plot 7 Kolawole Shonibare Street, by Eleganza, Ajao Estate',
    phone: '+234 706 086 6333',
  },
  {
    city: 'Alaba Int\'l Market',
    address: 'Shop 02/02 Ground Floor, 5 Igbede Road, Ojo, Alaba International Market',
    phone: '+234 706 086 6333',
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      {/* Main Footer */}
      <div className="container-main py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-display text-2xl text-white tracking-tighter font-light block">Sarvic Global</span>
              <span className="text-2xs tracking-widest text-gold/80 uppercase font-sans" style={{ letterSpacing: '0.2em' }}>Ltd</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">
              Connecting global trade without boundaries. Integrated logistics, procurement, manufacturing, and supply chain solutions across Asia, Europe, and Africa.
            </p>
            <div className="space-y-2">
              <a href="mailto:sarvicglobaltd@gmail.com" className="flex items-center gap-2 text-2xs text-white/50 hover:text-gold transition-colors tracking-wider">
                <Envelope size={12} />
                sarvicglobaltd@gmail.com
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="eyebrow text-white/40 mb-5">Services</h4>
            <ul className="space-y-3">
              {[
                { label: 'Integrated Logistics', href: '/services/logistics' },
                { label: 'Global Procurement', href: '/services/procurement' },
                { label: 'Manufacturing', href: '/services/manufacturing' },
                { label: 'Automotive', href: '/services/automotive' },
                { label: 'FX Services', href: '/services/fx-services' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="eyebrow text-white/40 mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Global Offices', href: '/offices' },
                { label: 'Projects & Gallery', href: '/projects' },
                { label: 'News & Insights', href: '/news' },
                { label: 'Track Shipment', href: '/track' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Presence */}
          <div>
            <h4 className="eyebrow text-white/40 mb-5">Global Offices</h4>
            <div className="space-y-5">
              {offices.map((office) => (
                <div key={office.city}>
                  <p className="text-2xs text-gold tracking-wider uppercase mb-1">{office.city}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{office.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-main flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          <p className="text-2xs text-white/30 tracking-wider">
            © {new Date().getFullYear()} Guangzhou Sarvic Global Trading Co., Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Cookies', href: '/cookies' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="text-2xs text-white/30 hover:text-white/60 transition-colors tracking-wider">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
