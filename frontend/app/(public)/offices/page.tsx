import type { Metadata } from 'next';
import { MapPin, Phone, Clock } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
  title: 'Global Offices',
  description: 'Find Sarvic Global Ltd offices in Guangzhou China, Istanbul Turkey, Lagos Nigeria, and Alaba International Market.',
};

const offices = [
  {
    name: 'China Office',
    city: 'Guangzhou',
    address: 'Floor 4, District D, Lot D113, Guota International Trade City, 27 Guangyuan West Road, Yuexiu District, Guangzhou City',
    phone: '+86 195 6680 5494',
    image: 'https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 23.1291, lng: 113.2644,
  },
  {
    name: 'Turkey Office',
    city: 'Istanbul',
    address: 'Namik Kamal Caddesi Isi Markezi No 25, Kat 3/Kapi 21',
    phone: '+90 546 990 4659',
    image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 41.0082, lng: 28.9784,
  },
  {
    name: 'Nigeria Head Office',
    city: 'Lagos — Ajao Estate',
    address: 'Plot 7 Kolawole Shonibare Street, by Eleganza, Ajao Estate',
    phone: '+234 706 086 6333',
    image: 'https://images.pexels.com/photos/2096578/pexels-photo-2096578.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 6.5244, lng: 3.3792,
  },
  {
    name: 'Alaba International Market Office',
    city: 'Lagos — Ojo, Alaba',
    address: 'Shop 02/02, Ground Floor, 5 Igbede Road, Ojo, Alaba International Market',
    phone: '+234 706 086 6333',
    image: 'https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=800',
    lat: 6.4474, lng: 3.1965,
  },
];

export default function OfficesPage() {
  return (
    <>
      <section className="bg-navy pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="container-main">
          <p className="eyebrow text-gold mb-4">Global Offices</p>
          <h1 className="font-display text-4xl md:text-6xl text-white font-light tracking-tighter max-w-3xl text-balance">
            Rooted Across Three Continents
          </h1>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office) => (
              <div key={office.name} className="bg-white border border-rule overflow-hidden">
                <div className="relative aspect-[16/9]">
                  <img src={office.image} alt={office.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-7">
                  <p className="text-2xs tracking-widest text-gold uppercase mb-2">{office.city}</p>
                  <h2 className="font-display text-2xl text-ink mb-4">{office.name}</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} weight="light" className="text-mist shrink-0 mt-0.5" />
                      <p className="text-sm text-steel leading-relaxed">{office.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} weight="light" className="text-mist shrink-0" />
                      <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-sm text-steel hover:text-ink">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} weight="light" className="text-mist shrink-0" />
                      <p className="text-sm text-steel">Mon – Sat, 9:00 AM – 6:00 PM (Local Time)</p>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${office.lat},${office.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-5 text-2xs tracking-wider uppercase text-gold hover:text-gold-dark transition-colors"
                  >
                    View on Map →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
