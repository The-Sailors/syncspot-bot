import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';

puppeteer.use(StealthPlugin());
(async () => {
    // headers are required to bypass the google meet headless browser detection
    let headers = {
        'authority': 'meet.google.com',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    const browser = await puppeteer.launch({
        headless: true, // to run the browser inside the container we need to set it to true or shell.
        executablePath: '/usr/bin/google-chrome',
        args: [
            "--incognito", // open the browser using the incognito mode
            "--disable-feature=IsolateOrigins, site-per-process",
            "--disable-infobars",
            "--no-sandbox",
            "--disable-web-security",
            "--disable-setuid-sandbox",
            "--autoplay-policy=user-gesture-required",
        ],
        // ignoreDefaultArgs: true
    });

    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://meet.google.com", ["microphone", "camera", "notifications"]);
    const [page] = await browser.pages();
    await page.setExtraHTTPHeaders(headers)
    await page.goto("https://meet.google.com/kco-tdsh-grg", { waitUntil: "networkidle0" });

    const pageContent = await page.content();
    //save pageContent to a file and check if the meeting code is invalid
    if (!pageContent.includes('Continue without microphone and camera')) {
        console.log('Invalid meeting code')
        await browser.close();
        return;
    }


    const continueWithoutMicroAndCam = await page.waitForSelector('#yDmH0d > div.VfPpkd-Sx9Kwc.cC1eCc.UDxLd.PzCPDd.xInSQ.PBbOsf.VfPpkd-Sx9Kwc-OWXEXe-FNFY6c > div.VfPpkd-wzTsW > div > div > div > div > div.VlHPz > div > div:nth-child(2) > button')
    await continueWithoutMicroAndCam?.click()
    console.log('clicked on continue without mic and cam')

    const botNameInputBox = await page.$('input[type=text]')
    botNameInputBox?.type('SyncSpot Bot')
    await page.keyboard.press('Enter')
    console.log('entered bot name')


    const askToJoin = await page.waitForSelector('#yDmH0d > c-wiz > div > div > div:nth-child(25) > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.d7iDfe.NONs6c > div.shTJQe > div.jtn8y > div.XCoPyb > div:nth-child(1) > button')
    await askToJoin?.click()
    console.log('clicked on ask to join')

    const chatWithEveryOneButton = await page.waitForSelector('#yDmH0d > c-wiz > div > div > div:nth-child(24) > div.crqnQb > div.fJsklc.nulMpf.Didmac.G03iKb > div > div > div.jsNRx > div > div:nth-child(3) > div > div > span > button')
    await chatWithEveryOneButton?.click({ delay: 2000 }) // delay is added to wait for the chat drawler to open
    console.log('clicked on chat with everyone')

    const chatInput = await page.waitForSelector('#bfTqV')
    await chatInput?.type('Hello Everyone')
    await page.keyboard.press('Enter')
    console.log('typed hello everyone')
})();
