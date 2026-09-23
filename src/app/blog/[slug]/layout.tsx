import { Metadata } from 'next';
import { getBlogBySlug } from '@/data/blogArticles';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogBySlug(slug);

  if (!article) {
    return {
      title: "Clinical Health Guides & Insights | Dr. Monali's Clinic Kolhapur",
    };
  }

  return {
    title: `${article.title} | Dr. Monali's Clinic Kolhapur`,
    description: article.excerpt,
    keywords: [
      article.category.toLowerCase(),
      'homeopathy kolhapur',
      'skin health kolhapur',
      'hair care kolhapur',
      'dr monali subhedar article',
    ],
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://drmonalisclinic.com/blog/${article.slug}`,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      images: [{ url: article.image || '/clinic-logo.png' }],
    },
  };
}

export default function BlogArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
