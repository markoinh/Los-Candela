import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:3001';
const viewName = process.argv[3] || 'dashboard';

const dir = './temporary screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = path.join(dir, `screenshot-${next}-${viewName}.png`);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/marco/.cache/puppeteer/chrome/win64-147.0.7727.57/chrome-win64/chrome.exe',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));

// Click the nav item for the requested view
if (viewName !== 'dashboard') {
  await page.evaluate((v) => {
    const el = document.querySelector(`[data-view="${v}"]`);
    if (el) el.click();
  }, viewName);
  await new Promise(r => setTimeout(r, 800));
}

await page.screenshot({ path: filename, fullPage: false });
await browser.close();
console.log('Screenshot saved:', filename);
