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

function pageUrl(locale, pagePath, origin) {
  const prefix = `${origin}/${locale}`;
  if (pagePath === 'index.html') return `${prefix}/`;
  return `${prefix}/${pagePath.replace(/\/index\.html$/, '/')}`;
}

function collectUrls(origin) {
  const urls = [];
  for (const page of PAGES) {
    for (const loc of LOCALES) {
      urls.push(pageUrl(loc, page, origin));
    }
  }
  return urls;
}

const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'seo.config.json'), 'utf8'));
const { siteOrigin, host, indexNowKey } = config;
const keyLocation = `${siteOrigin}/${indexNowKey}.txt`;
const body = {
  host,
  key: indexNowKey,
  keyLocation,
  urlList: collectUrls(siteOrigin),
};

const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

let ok = 0;
for (const endpoint of endpoints) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  if (res.ok || res.status === 202) {
    ok += 1;
    console.log(`IndexNow OK (${res.status}): ${endpoint}`);
  } else {
    const text = await res.text();
    console.warn(`IndexNow ${res.status} from ${endpoint}: ${text || res.statusText}`);
  }
}

if (!ok) {
  process.exitCode = 1;
} else {
  console.log(`Submitted ${body.urlList.length} URLs`);
}
