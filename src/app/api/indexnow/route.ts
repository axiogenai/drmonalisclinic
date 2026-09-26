import { NextResponse } from 'next/server';
import { blogArticles } from '@/data/blogArticles';

const INDEXNOW_KEY = '797951e06ae046b2be55771d9b2fdd35';
const HOST = 'www.drmonalisclinic.com';
const BASE_URL = `https://${HOST}`;

export async function GET() {
  return triggerIndexNow();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const customUrls = Array.isArray(body?.urls) ? body.urls : undefined;
    return triggerIndexNow(customUrls);
  } catch {
    return triggerIndexNow();
  }
}

async function triggerIndexNow(customUrls?: string[]) {
  const defaultUrls = [
    `${BASE_URL}/`,
    `${BASE_URL}/homeopathy`,
    `${BASE_URL}/cosmetic-treatments`,
    `${BASE_URL}/hair-and-skin`,
    `${BASE_URL}/appointment`,
    `${BASE_URL}/about`,
    `${BASE_URL}/shop`,
    `${BASE_URL}/privacy-policy`,
    `${BASE_URL}/terms-and-conditions`,
    ...blogArticles.map((article) => `${BASE_URL}/blog/${article.slug}`),
  ];

  const urlList = customUrls && customUrls.length > 0 ? customUrls : defaultUrls;

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const [indexNowRes, bingRes] = await Promise.allSettled([
      fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      }),
      fetch('https://www.bing.com/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      }),
    ]);

    const indexNowStatus = indexNowRes.status === 'fulfilled' ? indexNowRes.value.status : 'failed';
    const bingStatus = bingRes.status === 'fulfilled' ? bingRes.value.status : 'failed';

    return NextResponse.json({
      success: true,
      message: 'IndexNow request submitted to Bing and search engines',
      submittedUrlsCount: urlList.length,
      indexNowStatus,
      bingStatus,
      urlList,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to submit to IndexNow',
      },
      { status: 500 }
    );
  }
}
