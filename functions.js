const puppeteer = require('puppeteer');
const validUrl = require('valid-url');
const fs = require('fs');

function createUniqueID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function getDataFromPuppeteer(url) {
    return new Promise(async (resolve, reject) => {
	try{
		var domain = (new URL(url));
			domain = domain.hostname;
			args = ['--no-sandbox','--disable-extensions','--headless','--show-paint-rects', '--disable-dev-shm-usage','--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--disable-gpu']
			const browser = await puppeteer.launch({ headless: true, args: args, devtools: false, ignoreHTTPSErrors: true, ignoreDefaultArgs: ["--disable-extensions"]});
			const page = await browser.newPage();
			const navigationPromise = page.waitForNavigation();
			// Set Viewport
			await page.setViewport({ width: 1366, height: 768 });
			// Tracing Fine Name
			const fileName = createUniqueID(40)
			// Tracing Start
			await page.tracing.start({ screenshots: true, path: fileName+'.json' });
			// Open Url In Browser
			await page.goto(url, {waitUntil: "networkidle0", timeout: 60000});
			// Tracing Stop
			await page.tracing.stop();
			// Read Tracing Data From File & Create Variable
			const tracingData = await JSON.parse(fs.readFileSync('./'+fileName+'.json', 'utf8'));
			// Tracing File Remove
			await fs.unlinkSync('./'+fileName+'.json');
			// Evaluate data from page
			let pageData = await page.evaluate((tracingData) => {
										let jsonData = { };
										jsonData['title']  = (document.querySelector('title'))?document.querySelector('title').innerText:''
										jsonData['description']  = (document.querySelector('meta[name="description"]'))?document.querySelector('meta[name="description"]').content:''
										jsonData['tracingData'] = tracingData
										return jsonData;
									},tracingData);
			browser.close();
		return resolve(pageData);
     }catch(e){
        return reject(e);
     }
    })
}


module.exports = { getDataFromPuppeteer };
