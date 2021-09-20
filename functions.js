const puppeteer = require('puppeteer');
const validUrl = require('valid-url');
const fs = require('fs');


function getDataFromPuppeteer(url) {
    return new Promise(async (resolve, reject) => {
	try{
		var domain = (new URL(url));
			domain = domain.hostname;
			args = ['--no-sandbox','--disable-extensions','--headless','--show-paint-rects', '--disable-dev-shm-usage','--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--disable-gpu']
			const browser = await puppeteer.launch({ headless: true, args: args, devtools: false, ignoreHTTPSErrors: true, ignoreDefaultArgs: ["--disable-extensions"]});
			const page = await browser.newPage();
			const navigationPromise = page.waitForNavigation();
			await page.setViewport({ width: 1366, height: 768 });
			await page.goto(url, {waitUntil: "networkidle0", timeout: 60000});
			let pageData = await page.evaluate(() => {
										let jsonData = { };
										jsonData['title']  = (document.querySelector('title'))?document.querySelector('title').innerText:''
										jsonData['description']  = (document.querySelector('meta[name="description"]'))?document.querySelector('meta[name="description"]').content:''
										return jsonData;
									});
			browser.close();
		return resolve(pageData);
     }catch(e){
        return reject(e);
     }
    })
}


module.exports = { getDataFromPuppeteer };
