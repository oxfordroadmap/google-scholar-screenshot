const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const authorID = process.env.AUTHOR_ID;
  const lang = process.env.LANG || 'en';
  const selector = '#gsc_rsb_cit';

  if (!authorID) {
    console.error('❌ Missing AUTHOR_ID environment variable.');
    process.exit(1);
  }

  const url = `https://scholar.google.com/citations?user=${authorID}&hl=${lang}`;
  const output = `${authorID}_${lang}.png`;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36'
  );
  await page.setViewport({ width: 1280, height: 900 });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Save full HTML for inspection
    const html = await page.content();
    fs.writeFileSync('debug_output.html', html);
    console.log('📝 Saved HTML to debug_output.html');

    // Save full-page screenshot
    await page.screenshot({ path: 'debug_fullpage.png', fullPage: true });
    console.log('📸 Saved full-page screenshot to debug_fullpage.png');

    // Wait for the citation panel
    await page.waitForSelector(selector, { timeout: 30000 });
    const element = await page.$(selector);
    if (!element) throw new Error(`Selector "${selector}" not found`);

    await element.screenshot({ path: output });
    console.log(`✅ Saved element screenshot: ${output}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  } finally {
    await browser.close();
  }
})();
