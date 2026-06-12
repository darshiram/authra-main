import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, browser: 'firefox' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  console.log('Navigating to http://localhost:5173/verify/test-cert ...');
  await page.goto('http://localhost:5173/verify/test-cert', { waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log('Navigation timeout or error:', e.message));
  
  console.log('Page loaded, waiting 2 seconds for any delayed errors...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const rootHtml = await page.$eval('#root', el => el.innerHTML).catch(e => e.message);
  console.log('ROOT HTML LENGTH:', rootHtml.length);
  
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  console.log('Saved screenshot to screenshot.png');
  
  await browser.close();
})();
