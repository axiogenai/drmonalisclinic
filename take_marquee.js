const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    // Scroll to Marquee & bottom of services
    await page.evaluate(() => {
      window.scrollTo(0, 4700);
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:\\Users\\aditya\\.gemini\\antigravity\\scratch\\primederm\\screenshot_marquee.png', fullPage: false });

    // Scroll to Results / Transformation
    await page.evaluate(() => {
      window.scrollTo(0, 5600);
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:\\Users\\aditya\\.gemini\\antigravity\\scratch\\primederm\\screenshot_transformation.png', fullPage: false });

    await browser.close();
    console.log('Saved marquee and transformation screenshots!');
  } catch (err) {
    console.error('Puppeteer error:', err);
    process.exit(1);
  }
})();
