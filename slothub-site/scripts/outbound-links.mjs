const siteHosts = new Set(['slothub.com.tw', 'www.slothub.com.tw', 'slothub-4cu.pages.dev']);
const anchorPattern = /<a\b[^>]*>/gi;
const hrefPattern = /\bhref\s*=\s*(["'])(.*?)\1/i;
const relPattern = /\brel\s*=\s*(["'])(.*?)\1/i;

function isOutbound(href) {
  let url;
  try {
    url = new URL(href.replaceAll('&amp;', '&'));
  } catch {
    return false;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return false;
  return !siteHosts.has(url.hostname) && !url.hostname.endsWith('.slothub-4cu.pages.dev');
}

function hasNofollow(anchor) {
  const rel = anchor.match(relPattern)?.[2] ?? '';
  return rel.split(/[\s,]+/).some((value) => value.toLowerCase() === 'nofollow');
}

export function qualifyOutboundLinks(html) {
  return html.replace(anchorPattern, (anchor) => {
    const href = anchor.match(hrefPattern)?.[2];
    if (!href || !isOutbound(href) || hasNofollow(anchor)) return anchor;
    const rel = anchor.match(relPattern);
    if (rel) {
      return anchor.replace(relPattern, (_match, quote, value) => `rel=${quote}${value} nofollow${quote}`);
    }
    return anchor.replace(/>$/, ' rel="nofollow">');
  });
}

export function findUnqualifiedOutboundLinks(html) {
  return [...html.matchAll(anchorPattern)]
    .map((match) => match[0])
    .filter((anchor) => {
      const href = anchor.match(hrefPattern)?.[2];
      return href && isOutbound(href) && !hasNofollow(anchor);
    });
}
