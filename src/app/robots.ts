import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.drmonalisclinic.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Bingbot',
          'Applebot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
        ],
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
      {
        // Explicitly welcome AI and LLM Search Engine crawlers for AEO (Answer Engine Optimization)
        userAgent: [
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
