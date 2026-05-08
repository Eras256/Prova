import type { MetadataRoute } from 'next';

const SITE_URL = 'https://prova.io';

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/product', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/product/security', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/developers', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/developers/quick-start', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/explorer', priority: 0.85, changeFrequency: 'daily' },
  { path: '/solutions/operators', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/changelog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/careers', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
