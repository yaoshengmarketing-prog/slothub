# Slot Hub architecture

## Boundaries

- `core`: Astro layouts, URL helpers, SEO, sitemap/RSS, build and deployment validation.
- `slothub`: games, providers, guides, Slot/fishing taxonomy and page presentation.
- `optional islands`: search, explorer, comparison and future calculators.

Content Collections are the current source. Pages receive normalized records through a small mapping layer so a future D1 repository can replace file reads without rewriting React views.

Provider records scale independently and support formal/brand names, aliases, parent and child brands, multiple roles, origin regions, service markets, Asia tags, languages, game types and lifecycle status. Only `published` records generate public pages; `candidate`, `draft` and `inactive` records remain out of routes and sitemap.

## Data rules

- BNG/Booongo and Booming Games are independent providers.
- QTech is modeled as an aggregator and excluded from developer filters.
- Unknown values remain absent.
- Each content record is independent; sources store a URL and checked date.

## URL and indexing

- Every route uses a trailing slash.
- Production (`https://www.slothub.com.tw/`, Cloudflare Pages) is indexable; `slothub.com.tw` 301-redirects to `www`.
- Preview hosts (`*.pages.dev`) get `noindex,nofollow` in HTML and HTTP headers via `functions/_middleware.js`.
- Preview omits canonical links and publishes an empty sitemap.
- Production-mode builds use `https://www.slothub.com.tw/` canonical URLs.
- `/compare/` and `/search/` use `noindex,follow` in production and never enter the sitemap.

Legacy Wix URLs are 301-redirected by the Pages middleware using `src/lib/legacy-wix-routes.mjs`. DNS and custom-domain settings live in Cloudflare and are changed only with owner approval.
