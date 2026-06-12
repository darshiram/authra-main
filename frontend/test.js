import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  
  const rootContent = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log("ROOT CONTENT:", rootContent.length, "characters");
  if (rootContent.length < 500) {
     console.log("ROOT CONTENT:", rootContent);
  }
  
  await browser.close();
})();
