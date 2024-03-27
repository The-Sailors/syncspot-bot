import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';

puppeteer.use(StealthPlugin());
(async () => {
    let headers = {
        'authority': 'meet.google.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'cookie': 'NID=512=KVujZFrFho2dodN40Lc88w-309nWZf6ZSls6U6m1Z1SQUIhpnR1jkBuim89OTFqZwsPWmvc65Z_0cG4IO_MZ9RWaI0ktMocM3U6ddJ6IDAdxYvVfb6sv8QWMKJknhzLRVLxlp_vko8evDzfxYi8dptekNlu-zKyyaPw6ZUQbiCU; OTZ=7486603_68_64_73560_68_416340',
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
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    const browser = await puppeteer.launch({ headless: true,
        args: [
            "--incognito",
            "--disable-feature=IsolateOrigins, site-per-process",
            "--disable-infobars",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--autoplay-policy=user-gesture-required",
        ],
        ignoreDefaultArgs: true,
    });

    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://meet.google.com", ["microphone", "camera", "notifications"]);
    const [page] = await browser.pages();
    await page.setExtraHTTPHeaders(headers)
    await page.goto("https://meet.google.com/kvo-haqs-djj", { waitUntil: "networkidle0" }); // 2 seconds timeout

    const continueWithoutMicroAndCam = await page.waitForSelector('#yDmH0d > div.VfPpkd-Sx9Kwc.cC1eCc.UDxLd.PzCPDd.xInSQ.PBbOsf.VfPpkd-Sx9Kwc-OWXEXe-FNFY6c > div.VfPpkd-wzTsW > div > div > div > div > div.VlHPz > div > div:nth-child(2) > button')

    await continueWithoutMicroAndCam?.click()
    const inputBox = await page.$('input[type=text]')
    inputBox?.type('SyncSpot Bot')
    await page.keyboard.press('Enter')

    const askToJoin = await page.waitForSelector('#yDmH0d > c-wiz > div > div > div:nth-child(25) > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.d7iDfe.NONs6c > div.shTJQe > div.jtn8y > div.XCoPyb > div:nth-child(1) > button')
    await askToJoin?.click()
})();
