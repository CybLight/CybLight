import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LOCALES = ['ru', 'uk', 'en'];
const PAGES = [
  'index.html',
  'games/index.html',
  'contacts/index.html',
  'projects/index.html',
  'donate/index.html',
  'privacy/index.html',
];

const LEGACY_REDIRECTS = [
  'games/index.html',
  'contacts/index.html',
  'projects/index.html',
  'donate/index.html',
  'privacy/index.html',
];

const LEGACY_PATHS = ['games', 'contacts', 'projects', 'donate', 'privacy'];
const SITE_ORIGIN = 'https://cyblight.org';

function loadLocale(code) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'locales', `${code}.json`), 'utf8'));
}

function get(obj, key) {
  return key.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyReplacement(out, from, to) {
  const src = from.replace(/\r\n/g, '\n');
  const dst = to.replace(/\r\n/g, '\n');
  if (!src.trim()) return out;

  if (out.includes(src)) {
    return out.split(src).join(dst);
  }

  const pattern = escapeRegex(src.trim()).replace(/\s+/g, '\\s+');
  const re = new RegExp(pattern, 'g');
  return out.replace(re, dst);
}

function pageUrl(locale, pagePath) {
  const prefix = `https://cyblight.org/${locale}`;
  if (pagePath === 'index.html') return `${prefix}/`;
  return `${prefix}/${pagePath.replace(/\/index\.html$/, '/')}`;
}

function hreflangBlock(pagePath) {
  return LOCALES.map(
    (loc) =>
      `    <link rel="alternate" hreflang="${loc}" href="${pageUrl(loc, pagePath)}" />`
  )
    .concat(`    <link rel="alternate" hreflang="x-default" href="${pageUrl('ru', pagePath)}" />`)
    .join('\n');
}

function render(template, locale, localeCode, pagePath) {
  const prefix = `/${localeCode}`;
  const canonical = pageUrl(localeCode, pagePath);

  const homeUrl = pageUrl(localeCode, 'index.html');

  let out = template
    .replace(/\{\{L\}\}/g, prefix)
    .replace(/\{\{lang\}\}/g, localeCode)
    .replace(/\{\{htmlLang\}\}/g, locale.htmlLang)
    .replace(/\{\{ogLocale\}\}/g, locale.ogLocale)
    .replace(/\{\{localeTag\}\}/g, locale.localeTag)
    .replace(/\{\{canonical\}\}/g, canonical)
    .replace(/\{\{homeUrl\}\}/g, homeUrl)
    .replace(/\{\{site\}\}/g, SITE_ORIGIN)
    .replace(/\{\{hreflang\}\}/g, hreflangBlock(pagePath));

  out = out.replace(/\{\{t\.([^}]+)\}\}/g, (_, key) => {
    const val = get(locale.strings, key);
    if (val === undefined) {
      throw new Error(`Missing translation key "${key}" for locale "${localeCode}"`);
    }
    return val;
  });

  if (localeCode !== 'ru' && Array.isArray(locale.replacements)) {
    out = out.replace(/\r\n/g, '\n');
    const sorted = [...locale.replacements].sort((a, b) => b[0].length - a[0].length);
    for (const [from, to] of sorted) {
      out = applyReplacement(out, from, to);
    }
  }

  return out;
}

function writeJsStrings(localeCode, locale) {
  const js = `window.CYB_LOCALE = ${JSON.stringify(localeCode)};\nwindow.CYB_STRINGS = ${JSON.stringify(locale.js || {})};\n`;
  fs.writeFileSync(path.join(ROOT, 'js', `strings-${localeCode}.js`), js, 'utf8');
}

function writeRootRedirect() {
  const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CybLight</title>
  <link rel="canonical" href="https://cyblight.org/ru/" />
  <script>
    (function () {
      var saved = localStorage.getItem('cyblight-lang');
      var langs = ['ru', 'uk', 'en'];
      var nav = (navigator.language || '').toLowerCase();
      var pick = 'ru';
      if (saved && langs.indexOf(saved) !== -1) pick = saved;
      else if (nav.indexOf('uk') === 0 || nav.indexOf('ua') !== -1) pick = 'uk';
      else if (nav.indexOf('en') === 0) pick = 'en';
      location.replace('/' + pick + '/');
    })();
  </script>
  <meta http-equiv="refresh" content="0;url=/ru/" />
</head>
<body>
  <p><a href="/ru/">CybLight</a></p>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, 'index.html'), html, 'utf8');
}

function writeLegacyRedirect(relPath) {
  const target = `/ru/${relPath.replace(/\/index\.html$/, '/')}`;
  const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0;url=${target}" />
  <link rel="canonical" href="https://cyblight.org${target}" />
  <script>location.replace('${target}');</script>
</head>
<body><p><a href="${target}">Redirecting…</a></p></body>
</html>
`;
  const outPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
}

function sitemapAlternates(pagePath) {
  return LOCALES.map(
    (loc) =>
      `    <xhtml:link rel="alternate" hreflang="${loc}" href="${pageUrl(loc, pagePath)}" />`
  )
    .concat(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('ru', pagePath)}" />`
    )
    .join('\n');
}

function writeSitemap() {
  const entries = [];
  for (const page of PAGES) {
    for (const loc of LOCALES) {
      entries.push(`  <url>
    <loc>${pageUrl(loc, page)}</loc>
${sitemapAlternates(page)}
    <changefreq>weekly</changefreq>
  </url>`);
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
}

function writeRedirects() {
  const lines = ['# 301 redirects for crawlers (Cloudflare Pages / Netlify)', '/ /ru/ 301'];
  for (const segment of LEGACY_PATHS) {
    lines.push(`/${segment} /ru/${segment}/ 301`);
    lines.push(`/${segment}/ /ru/${segment}/ 301`);
  }
  fs.writeFileSync(path.join(ROOT, '_redirects'), `${lines.join('\n')}\n`, 'utf8');
}

// Build localized pages
for (const code of LOCALES) {
  const locale = loadLocale(code);
  writeJsStrings(code, locale);

  for (const page of PAGES) {
    const template = fs.readFileSync(path.join(ROOT, 'templates', page), 'utf8');
    const html = render(template, locale, code, page);
    const outPath = path.join(ROOT, code, page);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, 'utf8');
  }
}

writeRootRedirect();
for (const p of LEGACY_REDIRECTS) writeLegacyRedirect(p);
writeSitemap();
writeRedirects();

console.log('Built locales:', LOCALES.join(', '));
