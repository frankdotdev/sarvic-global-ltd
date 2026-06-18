import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sarvicglobal.com';
  const routes = [
    '', '/about', '/services', '/services/logistics', '/services/procurement',
    '/services/manufacturing', '/services/automotive', '/services/fx-services',
    '/track', '/offices', '/projects', '/news', '/contact',
    '/privacy-policy', '/terms', '/cookies',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/track' ? 0.9 : 0.7,
  }));
}
