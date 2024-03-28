package main

import (
	"context"
	"log/slog"
	"time"

	"github.com/chromedp/cdproto/browser"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

func main() {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", false),
		chromedp.Flag("incognito", true),
		chromedp.UserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"),
		// chromedp.Flag("autoplay-policy", "no-user-gesture-required"),
		// chromedp.Flag("disable-feature", "IsolateOrigins, site-per-process"),
		// chromedp.Flag("disable-infobars", true),
		// chromedp.Flag("disable-setuid-sandbox", true),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)

	defer cancel()
	ctx, cancel := chromedp.NewContext(
		allocCtx,
	)
	defer cancel()

	done := make(chan struct{})
	headers := map[string]interface{}{
		"authority":                         "meet.google.com",
		"accept":                            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
		"accept-language":                   "en-US,en;q=0.9",
		"cache-control":                     "max-age=0",
		"cookie":                            "NID=512=KVujZFrFho2dodN40Lc88w-309nWZf6ZSls6U6m1Z1SQUIhpnR1jkBuim89OTFqZwsPWmvc65Z_0cG4IO_MZ9RWaI0ktMocM3U6ddJ6IDAdxYvVfb6sv8QWMKJknhzLRVLxlp_vko8evDzfxYi8dptekNlu-zKyyaPw6ZUQbiCU; OTZ=7486603_68_64_73560_68_416340",
		"sec-ch-ua":                         "'Chromium';v='122', 'Not(A:Brand';v='24', 'Google Chrome';v='122'",
		"sec-ch-ua-arch":                    "x86",
		"sec-ch-ua-bitness":                 "64",
		"sec-ch-ua-full-version":            "122.0.6261.111",
		"sec-ch-ua-full-version-list":       "'Chromium';v='122.0.6261.111', 'Not(A:Brand';v='24.0.0.0', 'Google Chrome';v='122.0.6261.111'",
		"sec-ch-ua-mobile":                  "?0",
		"sec-ch-ua-platform":                "Linux",
		"sec-ch-ua-platform-version":        "6.5.0",
		"sec-ch-ua-wow64":                   "?0",
		"sec-fetch-dest":                    "document",
		"sec-fetch-mode":                    "navigate",
		"sec-fetch-site":                    "none",
		"sec-fetch-user":                    "?1",
		"service-worker-navigation-preload": "true",
		"upgrade-insecure-requests":         "1",
		"user-agent":                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
	}
	// browser, err := chromedp.NewBrowser(ctx, "https://meet.google.com/fuo-ckik-kji", )
	err := chromedp.Run(ctx,
		network.Enable(),
		network.SetExtraHTTPHeaders(network.Headers(headers)),
		chromedp.Navigate("https://meet.google.com/fuo-ckik-kji"),
		browser.GrantPermissions([]browser.PermissionType{
			browser.PermissionTypeAudioCapture, browser.PermissionTypeVideoCapture, browser.PermissionTypeNotifications,
		}).WithOrigin("https://meet.google.com"),
		chromedp.Sleep(time.Duration(2)*time.Second),
	)
	if err != nil {
		slog.Error("Error in running chromedp", "error", err)
	}

	<-done
}
