const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    const screenshotPath = 'C:\\Users\\aditya\\.gemini\\antigravity\\scratch\\primederm\\screenshot_preview.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log('Saved viewport screenshot to:', screenshotPath);

    // Also take screenshot of services section
    await page.evaluate(() => {
      window.scrollTo(0, 1800);
    });
    await new Promise(r => setTimeout(r, 1000));
    const servicesPath = 'C:\\Users\\aditya\\.gemini\\antigravity\\scratch\\primederm\\screenshot_services.png';
    await page.screenshot({ path: servicesPath, fullPage: false });
    console.log('Saved services screenshot to:', servicesPath);

    // Also take screenshot of results section
    await page.evaluate(() => {
      window.scrollTo(0, 3200);
    });
    await new Promise(r => setTimeout(r, 1000));
    const resultsPath = 'C:\\Users\\aditya\\.gemini\\antigravity\\scratch\\primederm\\screenshot_results.png';
    await page.screenshot({ path: resultsPath, fullPage: false });
    console.log('Saved results screenshot to:', resultsPath);

    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error('Puppeteer error:', err);
    process.exit(1);
  }
})();
