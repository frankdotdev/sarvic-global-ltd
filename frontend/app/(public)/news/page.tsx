import type { Metadata } from 'next';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
  title: 'News & Insights',
  description: 'Updates, insights, and announcements from Sarvic Global Ltd on global trade, logistics, and supply chain developments.',
};

const articles = [
  {
    title: 'Understanding Customs Clearance Between China and Nigeria',
    excerpt: 'A practical overview of what importers should expect when clearing goods through Nigerian customs after ocean freight from Guangzhou.',
    date: 'June 2026',
    category: 'Logistics',
    image: 'https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Why Supplier Verification Matters in Global Procurement',
    excerpt: 'How thorough factory vetting protects your business from quality and compliance risk before goods ever leave the warehouse.',
    date: 'May 2026',
    category: 'Procurement',
    image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Building Materials Sourcing: What Importers Should Know',
    excerpt: 'Key considerations for sourcing tiles, sanitary ware, and structural materials at scale from Chinese manufacturing hubs.',
    date: 'April 2026',
    category: 'Manufacturing',
    image: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function NewsPage() {
  return (
    <>
      <section className="bg-navy pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="container-main">
          <p className="eyebrow text-gold mb-4">News & Insights</p>
          <h1 className="font-display text-4xl md:text-6xl text-white font-light tracking-tighter max-w-3xl text-balance">
            Perspectives on Global Trade
          </h1>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.title} className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden mb-5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-2xs tracking-widest text-gold uppercase mb-3">{article.category} · {article.date}</p>
                <h2 className="font-display text-xl text-ink mb-3 leading-snug group-hover:text-gold-dark transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-mist leading-relaxed mb-4">{article.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-2xs tracking-wider uppercase text-ink">
                  Read More
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
