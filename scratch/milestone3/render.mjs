// Renderiza el diagrama HTML a PNG en alta resolución (3x)
import { chromium } from '/home/vaiosvaios/Prova/node_modules/.pnpm/playwright@1.59.1/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1648, height: 1200 },
  deviceScaleFactor: 3,
});
await page.goto('file:///home/vaiosvaios/Prova/scratch/milestone3/diagrama-arquitectura-v2.html');
await page.waitForTimeout(400);
const el = page.locator('#canvas');
await el.screenshot({ path: '/home/vaiosvaios/Prova/scratch/milestone3/prova-arquitectura-m3-v2.png' });
await browser.close();
console.log('PNG generado');
