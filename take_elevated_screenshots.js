const puppeteer = require('puppeteer');

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

    // 1. Hero
    await page.screenshot({ path: 'C:/Users/aditya/.gemini/antigravity/scratch/primederm/elevated_hero.png', fullPage: false });

    // 2. Doctor Section
    await page.evaluate(() => window.scrollTo(0, 1500));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'C:/Users/aditya/.gemini/antigravity/scratch/primederm/elevated_doctor.png', fullPage: false });

    // 3. Services with filter pills
    await page.evaluate(() => window.scrollTo(0, 2300));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'C:/Users/aditya/.gemini/antigravity/scratch/primederm/elevated_services.png', fullPage: false });

    // 4. Skin Diagnostic Quiz
    await page.evaluate(() => window.scrollTo(0, 4300));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'C:/Users/aditya/.gemini/antigravity/scratch/primederm/elevated_diagnostic.png', fullPage: false });

    // 5. Results Section
    await page.evaluate(() => window.scrollTo(0, 5600));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'C:/Users/aditya/.gemini/antigravity/scratch/primederm/elevated_results.png', fullPage: false });

    // 6. Fast Booking Form
    await page.evaluate(() => window.scrollTo(0, 7200));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'C:/Users/aditya/.gemini/antigravity/scratch/primederm/elevated_booking.png', fullPage: false });

    await browser.close();
    console.log('All elevated screenshots captured successfully!');
  } catch (err) {
    console.error('Puppeteer error:', err);
    process.exit(1);
  }
})();
