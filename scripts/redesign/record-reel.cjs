// Records a silent studio reel of the real site: the stage's three needs, the work film and the playground.
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2];
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, recordVideo: { dir: out, size: { width: 1280, height: 800 } } });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await page.evaluate(() => { try { localStorage.setItem('mp-motion', 'on'); } catch {} });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  await page.click('#need-found'); await page.waitForTimeout(2600);
  await page.click('#need-admin'); await page.waitForTimeout(2600);
  // Smooth scroll to the work reel
  const scrollTo = async (sel, offset = 0, steps = 30) => {
    const y = await page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + scrollY - o, [sel, offset]);
    const start = await page.evaluate(() => scrollY);
    for (let i = 1; i <= steps; i++) { const t = i / steps; const e = 1 - Math.pow(1 - t, 3); await page.evaluate((v) => scrollTo(0, v), start + (y - start) * e); await page.waitForTimeout(16); }
  };
  await scrollTo('.reel__body', 90); await page.waitForTimeout(2800);
  await page.click('#reel-tab-samp-hair-spa'); await page.waitForTimeout(2600);
  await scrollTo('#demo-website', 90); await page.waitForTimeout(500);
  const ba = await page.$('[data-ba]'); const box = await ba.boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5); await page.mouse.down();
  for (let i = 0; i <= 30; i++) { await page.mouse.move(box.x + box.width * (0.5 + 0.4 * Math.sin(i / 30 * Math.PI * 1.5)), box.y + box.height * 0.5); await page.waitForTimeout(40); }
  await page.mouse.up(); await page.waitForTimeout(600);
  await scrollTo('#demo-admin', 90); await page.waitForTimeout(300);
  await page.click('[data-flow-run]'); await page.waitForTimeout(4200);
  await ctx.close(); await browser.close();
})();
