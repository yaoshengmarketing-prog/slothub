# Slot Hub architecture

## Boundaries

- `core`: Astro layouts, URL helpers, SEO, sitemap/RSS, build and deployment validation.
- `slothub`: games, providers, guides, Slot/fishing taxonomy and page presentation.
- `optional islands`: search, explorer, comparison and future calculators.

Content Collections are the current source. Pages receive normalized records through a small mapping layer so a future D1 repository can replace file reads without rewriting React views.

## Data rules

- BNG/Booongo and Booming Games are independent providers.
- QTech is modeled as an aggregator and excluded from developer filters.
- Unknown values remain absent.
- Each content record is independent; sources store a URL and checked date.

## URL and indexing

- Every route uses a trailing slash.
- Preview HTML and HTTP headers use `noindex,nofollow`.
- Preview omits canonical links and publishes an empty sitemap.
- Production-mode builds use `https://www.slothub.com.tw/` canonical URLs.
- `/compare/` and `/search/` use `noindex,follow` in production and never enter the sitemap.

No DNS, Wix, custom-domain or redirect behavior is part of this phase.
