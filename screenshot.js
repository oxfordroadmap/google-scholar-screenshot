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

  // Spoof the browser more convincingly.
  await page.setUserAgent(
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36'
);
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Debug: 🧪 Save a full-page screenshot to see what the bot sees
  await page.screenshot({ path: 'debug_fullpage.png', fullPage: true });
  // Wait for the citation container to appear and be visible
  await page.waitForSelector(selector); // omit 'visible: true'

  const element = await page.$(selector);
  if (!element) {
    console.error(`❌ Selector "${selector}" not found at ${url}`);
    process.exit(1);
  }

  await element.screenshot({ path: output });
  console.log(`✅ Screenshot saved: ${output}`);

  await browser.close();
})();
