# Next development

- Add BNG/Booongo as an independent second-wave provider.
- Add QTech with `aggregator` organization type.
- Continue replacing or refreshing official game artwork when newer source assets are available.
- Expand verified RTP variants, release dates and volatility fields.
- Add fishing-game records before promoting the fishing explorer.
- Add RTP expectation calculator after search, explorer and comparison feedback.
- Keep the legacy Wix → new URL map (`slothub-site/src/lib/legacy-wix-routes.mjs`) up to date as GSC reports old URLs.

## Production status

The site is live: `https://www.slothub.com.tw/` is served by Cloudflare Pages from this repository (`main`), and `slothub.com.tw` 301-redirects to `www`. Wix is no longer serving the site.

Ongoing production checks after each deploy:

- Production pages return `index,follow`; only `*.pages.dev` preview hosts are `noindex,nofollow`.
- Canonical URLs use `https://www.slothub.com.tw/` and never a `pages.dev` hostname.
- `/sitemap.xml` lists only approved public URLs.
- Re-run build, internal-link, canonical, robots, sitemap and HTTP-header checks (`npm run verify`).
- DNS, custom-domain and indexing-policy changes need owner approval.

## Provider backlog supplied by project owner

Keep these as future independent provider records; do not create empty public pages before data is prepared.

- Asia priority: CQ9 Gaming, PG Soft, JILI, FC / Fa Chai, RSG / Royal Slot Gaming, Apex Top Gaming, KA Gaming.
- International: Pragmatic Play, NetEnt, Microgaming, Playtech, Play'n GO, Red Tiger.
- Distinctive studios: Nolimit City, Yggdrasil, ELK Studios, Big Time Gaming, Thunderkick.
- Emerging formats: SPRIBE (other / crash), BGaming.

Naming note: `ATG` may refer to more than one company. The current first-wave `ATG Games / Agile Titan Games` record must not be merged with owner-supplied `Apex Top Gaming` without explicit identity mapping. BNG / Booongo and Booming Games remain separate.
