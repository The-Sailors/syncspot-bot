import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';
import 'dotenv/config';

// by default we aren't exporting the .env file into the docker container.
const HEADLESS = process.env.HEADLESS === 'false' ? false : true; // default is true
puppeteer.use(StealthPlugin()); // Useful to bypass the headless browser detection by google meet

const headers = {
    'authority': 'meet.google.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9,pt;q=0.8',
    'cache-control': 'max-age=0',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-arch': '"x86"',
    'sec-ch-ua-bitness': '"64"',
    'sec-ch-ua-full-version': '"122.0.6261.111"',
    'sec-ch-ua-full-version-list': '"Chromium";v="122.0.6261.111", "Not(A:Brand";v="24.0.0.0", "Google Chrome";v="122.0.6261.111"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': '"Linux"',
    'sec-ch-ua-platform-version': '"6.5.0"',
    'sec-ch-ua-wow64': '?0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'service-worker-navigation-preload': 'true',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'x-client-data': 'CI62yQEIorbJAQipncoBCNGgygEI35bLAQiVocsBCPKYzQEIh6DNAQi7yM0BCOPszQEI2ITOAQizhc4BCLiGzgEYmPXNARie+M0BGNKCzgE=',
};

puppeteer.use(StealthPlugin()); // Useful to bypass the headless browser detection by google meet
(async () => {
    // headers are required to bypass the google meet headless browser detection
    let headers = {
        'authority': 'meet.google.com',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    }
    const browser = await puppeteer.launch({
        headless: HEADLESS,
        executablePath: '/usr/bin/google-chrome-stable', // chrome-stable receive less updates than normal chrome, to it's better to use it in a production environment
        args: [
            "--incognito", // open the browser using the incognito mode
            "--disable-feature=IsolateOrigins, site-per-process",
            "--disable-infobars",
            "--no-sandbox",
            "--disable-web-security",
            "--disable-setuid-sandbox",
            "--autoplay-policy=user-gesture-required",
        ],
    });
    console.log('browser launched')
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://meet.google.com", ["microphone", "camera", "notifications"]);
    const [page] = await browser.pages();
    await page.setExtraHTTPHeaders(headers)
    await page.goto("https://meet.google.com/grj-ijxa-wqi", { waitUntil: "networkidle0" });

    console.log('waiting for continue without mic and cam button')
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
