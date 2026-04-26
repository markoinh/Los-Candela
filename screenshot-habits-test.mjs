import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const dir = './temporary screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(Boolean);
let next = nums.length ? Math.max(...nums) + 1 : 1;

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/marco/.cache/puppeteer/chrome/win64-147.0.7727.57/chrome-win64/chrome.exe',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 800));

// Go to Habits
await page.evaluate(() => document.querySelector('[data-view="habits"]').click());
await new Promise(r => setTimeout(r, 400));

// Open Add Habit modal
await page.evaluate(() => openHabitModal());
await new Promise(r => setTimeout(r, 400));

// Screenshot 1: modal open, first colour selected
await page.screenshot({ path: path.join(dir, `screenshot-${next++}-habit-modal-open.png`) });

// Select a different colour (Emerald, index 12)
await page.evaluate(() => {
  const swatches = document.querySelectorAll('#habit-colors .color-swatch');
  if (swatches[12]) selectHabitColor(swatches[12]);
});
await new Promise(r => setTimeout(r, 300));

// Screenshot 2: emerald selected
await page.screenshot({ path: path.join(dir, `screenshot-${next++}-habit-modal-color.png`) });

// Type a habit name and add
await page.type('#habit-name-input', 'Morning Run');
await page.click('button[onclick="saveHabit()"]');
await new Promise(r => setTimeout(r, 400));

// Add another habit
await page.evaluate(() => openHabitModal());
await new Promise(r => setTimeout(r, 300));
await page.type('#habit-name-input', 'Read 30 mins');
await page.evaluate(() => {
  const swatches = document.querySelectorAll('#habit-colors .color-swatch');
  if (swatches[3]) selectHabitColor(swatches[3]);
});
await page.click('button[onclick="saveHabit()"]');
await new Promise(r => setTimeout(r, 400));

// Add a third habit
await page.evaluate(() => openHabitModal());
await new Promise(r => setTimeout(r, 300));
await page.type('#habit-name-input', 'Meditate');
await page.evaluate(() => {
  const swatches = document.querySelectorAll('#habit-colors .color-swatch');
  if (swatches[6]) selectHabitColor(swatches[6]);
});
await page.click('button[onclick="saveHabit()"]');
await new Promise(r => setTimeout(r, 400));

// Screenshot 3: habit grid with 3 habits + delete buttons
await page.screenshot({ path: path.join(dir, `screenshot-${next++}-habit-grid.png`) });

await browser.close();
console.log('Done — screenshots saved');
