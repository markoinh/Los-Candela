import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const dir = './temporary screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = path.join(dir, `screenshot-${next}-habit-modal.png`);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/marco/.cache/puppeteer/chrome/win64-147.0.7727.57/chrome-win64/chrome.exe',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 800));
await page.evaluate(() => {
  document.querySelector('[data-view="habits"]').click();
});
await new Promise(r => setTimeout(r, 500));
await page.evaluate(() => { openHabitModal(); });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: filename });
await browser.close();
console.log('Saved:', filename);
