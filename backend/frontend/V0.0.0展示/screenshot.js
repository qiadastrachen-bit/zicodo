const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1) 产品主宣传图
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('file:///' + path.resolve(__dirname, '产品主宣传图.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.screenshot({
    path: path.join(__dirname, '产品主宣传图.png'),
    fullPage: false,
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
    type: 'png'
  });
  console.log('✓ 产品主宣传图.png 已生成');

  // 2) 图标库展示图
  await page.goto('file:///' + path.resolve(__dirname, '图标库展示图.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.screenshot({
    path: path.join(__dirname, '图标库展示图.png'),
    fullPage: false,
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
    type: 'png'
  });
  console.log('✓ 图标库展示图.png 已生成');

  await browser.close();
  console.log('\n全部完成！');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
