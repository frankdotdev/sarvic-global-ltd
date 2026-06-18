import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects & Gallery',
  description: 'A visual look into Sarvic Global Ltd operations — logistics, warehouses, vehicles, building materials, sanitary ware, apparel manufacturing, and corporate events.',
};

const categories = [
  { name: 'Logistics Operations', image: 'https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Warehouses', image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Vehicles', image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Building Materials', image: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Sanitary Ware', image: 'https://images.pexels.com/photos/6444368/pexels-photo-6444368.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Apparel Manufacturing', image: 'https://images.pexels.com/photos/4620843/pexels-photo-4620843.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Corporate Events', image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Port & Shipping', image: 'https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

export default function ProjectsPage() {
  return (
    <>
      <section className="bg-navy pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="container-main">
          <p className="eyebrow text-gold mb-4">Projects & Gallery</p>
          <h1 className="font-display text-4xl md:text-6xl text-white font-light tracking-tighter max-w-3xl text-balance">
            Our Work, Across Every Vertical
          </h1>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-rule">
            {categories.map((cat) => (
              <div key={cat.name} className="relative aspect-square group overflow-hidden bg-ink">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/55 transition-colors flex items-end p-5">
                  <p className="text-white text-sm font-medium tracking-wide">{cat.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
