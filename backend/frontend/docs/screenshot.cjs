const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 720, height: 920 });
  await page.goto('file:///D:/Ziling-app/backend/frontend/docs/zicodo-design-system-poster.html', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: 'D:/Ziling-app/backend/frontend/docs/zicodo-design-system-poster.png',
    fullPage: true,
    type: 'png'
  });
  await browser.close();
  console.log('OK');
})();
