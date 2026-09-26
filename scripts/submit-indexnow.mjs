// Script to submit Dr. Monali's Clinic URLs to Bing IndexNow
const INDEXNOW_KEY = '797951e06ae046b2be55771d9b2fdd35';
const HOST = 'www.drmonalisclinic.com';
const BASE_URL = `https://${HOST}`;

const urls = [
  `${BASE_URL}/`,
  `${BASE_URL}/homeopathy`,
  `${BASE_URL}/cosmetic-treatments`,
  `${BASE_URL}/hair-and-skin`,
  `${BASE_URL}/appointment`,
  `${BASE_URL}/about`,
  `${BASE_URL}/shop`,
  `${BASE_URL}/privacy-policy`,
  `${BASE_URL}/terms-and-conditions`,
  `${BASE_URL}/blog/homeopathy-treatment-chronic-skin-allergies`,
  `${BASE_URL}/blog/hair-fall-prp-therapy-homeopathy-growth`,
  `${BASE_URL}/blog/safe-natural-kidney-stone-dissolution-homeopathy`,
];

const payload = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
  urlList: urls,
};

async function submitToIndexNow() {
  console.log(`Submitting ${urls.length} URLs to Bing IndexNow...`);
  console.log(`Host: ${HOST}`);
  console.log(`Key: ${INDEXNOW_KEY}`);
  console.log(`Key Location: ${payload.keyLocation}`);
  console.log('URLs:');
  urls.forEach((u) => console.log(` - ${u}`));

  const endpoints = [
    { name: 'Bing IndexNow', url: 'https://www.bing.com/indexnow' },
    { name: 'IndexNow Master API', url: 'https://api.indexnow.org/indexnow' },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      console.log(`\n[${ep.name}] Status: ${res.status} ${res.statusText}`);
      if (res.status === 200 || res.status === 202) {
        console.log(`✓ [${ep.name}] Successfully accepted! (Code: ${res.status})`);
      } else {
        const text = await res.text();
        console.log(`! [${ep.name}] Response body: ${text}`);
      }
    } catch (err) {
      console.error(`✗ [${ep.name}] Request failed:`, err.message);
    }
  }

  console.log('\nDone!');
}

submitToIndexNow();
