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

    // Scroll to Results chips and clinical photo
    await page.evaluate(() => {
      window.scrollTo(0, 6000);
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'C:/Users/aditya/.gemini/antigravity/scratch/primederm/screenshot_results_chips.png', fullPage: false });

    await browser.close();
    console.log('Saved results chips screenshot successfully!');
  } catch (err) {
    console.error('Puppeteer error:', err);
    process.exit(1);
  }
})();
