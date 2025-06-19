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
  await page.goto(url, { waitUntil: 'networkidle2' });

  const element = await page.$(selector);
  if (!element) {
    console.error(`❌ Selector "${selector}" not found at ${url}`);
    process.exit(1);
  }

  await element.screenshot({ path: output });
  console.log(`✅ Screenshot saved: ${output}`);

  await browser.close();
})();
