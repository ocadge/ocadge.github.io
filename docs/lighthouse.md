# Lighthouse results

Run with PageSpeed Insights (Lighthouse 13.6.0, emulated Moto G Power on slow 4G) against the live site on 16 November 2026. Target from my build brief: 95 or higher in every category, LCP under 2.5 s, CLS under 0.1.

| Page                                                                                                         | Performance | Accessibility | Best Practices | SEO | LCP   | CLS | Total Blocking Time |
| ------------------------------------------------------------------------------------------------------------ | ----------- | ------------- | -------------- | --- | ----- | --- | ------------------- |
| [Home](https://pagespeed.web.dev/analysis/https-ocadge-github-io/jivlbudj3r?form_factor=mobile)              | 100         | 100           | 100            | 100 | 1.2 s | 0   | 0 ms                |
| [Explorer](https://pagespeed.web.dev/analysis/https-ocadge-github-io-explorer/m5ub92stkh?form_factor=mobile) | 99          | 100           | 100            | 100 | 1.7 s | 0   | 20 ms               |

## Remaining suggestions

- **Cache lifetimes:** GitHub Pages sets its own short cache headers, and the site can't change them.
- **Unused JavaScript on the explorer (about 90 KB):** mostly the chart library. The explorer is its own page, so this doesn't affect the main portfolio.

The home page's JavaScript is about 11 KB gzipped, well under the 100 KB budget.
