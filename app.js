const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false, args: ["--disable-features=WebRtcHideLocalIpsWithMdns"]});
    const page = await browser.newPage();
    await page.goto('https://haxball.com/headless');
    try {
        await page.addScriptTag({path: path.join(__dirname, './dist/room.js')});
    } catch(err) {
        console.log(err);
    }
})();