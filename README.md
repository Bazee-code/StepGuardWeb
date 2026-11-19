# StepGuardWeb

The marketing site for StepGuard, served by GitHub Pages at <https://stepguard.live>.
Pushing to `main` publishes it. Plain HTML/CSS, no build step.

## Pages

| Path | File | Notes |
|---|---|---|
| `/` | `index.html` | Homepage. Its Q&A section is mirrored in the `FAQPage` structured data in `<head>`; keep them in sync. |
| `/guides/` | `guides/index.html` | Hub listing every guide, newest first |
| `/guides/<slug>` | `guides/<slug>.html` | SEO guides, built from `guides/_template.html` |
| `/faq` | `faq.html` | Full FAQ, plus matching `FAQPage` structured data |
| `/contact`, `/privacy`, `/terms` | | Linked from the app's paywall and settings, so the URLs must not change |
| `/join` | `join.html` | Group invite fallback (`noindex`) |
| `/.well-known/apple-app-site-association` | | Universal links. Must stay at the root with no redirect. |

Shared files: `styles.css` (header, menu, homepage hero), `site.css` (sections + footer),
`guides.css`, `site.js` (sends an `app_store_click` event to Google Analytics).

Link internally with extensionless absolute paths (`/faq`, `/guides/how-to-stop-doomscrolling`).
GitHub Pages serves `faq.html` at `/faq`, and every page's canonical tag uses that form.

## App Store links

Every App Store button uses a campaign link so installs show up in App Store Connect › Analytics › Campaigns:

```
https://apps.apple.com/app/apple-store/id6745701169?pt=127825166&ct=<campaign>&mt=8
```

`ct` says where the click came from: `website_hero`, `website_footer`, `website_nav`, `website_<page>`,
`guide_<slug>`. Apple allows up to 40 characters.

## Publishing a guide

One good guide beats ten thin ones. Aim for one a day at most, and only as fast as quality allows.

1. Pick one search question to answer. Once Search Console has data, choose queries where the site
   already gets impressions but few clicks.
2. `cp guides/_template.html guides/<slug>.html`. Use a short, lowercase, hyphenated slug made of the keyword.
3. Replace every `{{PLACEHOLDER}}` and delete the `noindex` line. Answer the question in the first
   paragraph (the "Short answer" box). Add or remove sections as needed.
4. Add the guide to the top of `guides/index.html` and to `sitemap.xml`.
5. Link to it from at least two existing pages, ideally ones that already get traffic.
6. Run `python3 tools/check_guides.py` and fix anything it reports.
7. Preview locally (see below), push, then in Search Console use **URL Inspection › Request indexing**.

### Writing rules

- Write for the person searching, not for Google. No filler and no keyword stuffing.
- Never invent statistics, studies or quotes. If a number matters, link to its source.
- Mention StepGuard where it genuinely helps, usually once in the body plus the CTA box.
- Only claim what the app really does (below). If unsure, check the app code.

### Facts about the app (as of v2.2.5)

- Locks chosen apps, websites and categories with Apple's Screen Time API until a daily step goal is met,
  then unlocks them automatically. Goals reset at the start of each day.
- Steps come from Apple Health (iPhone, Apple Watch, any tracker that syncs to Health). iOS 18+.
- Free: one daily goal, lock 1 app, automatic unlock, basic tracking, join groups.
- Premium (Monthly, Annual, Lifetime; 3-day free trial on Annual): unlimited apps, website blocking,
  category locks, per-app goals up to 20,000 steps, create groups, daily/weekly/monthly charts.
- Groups share display name, whether you hit the goal, and your streak. **Never step counts.**
- Users can remove a lock, or all locks, at any time. There are no time limits, override codes or schedules.

## Preview locally

GitHub Pages serves `/faq` from `faq.html`; `python3 -m http.server` doesn't, so extensionless links
404 locally. Use any static server that tries `.html`, for example `npx serve .`.
