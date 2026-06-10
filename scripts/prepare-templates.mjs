import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const PAGES = [
  { src: 'index.html', dst: 'index.html' },
  { src: 'games/index.html', dst: 'games/index.html' },
  { src: 'contacts/index.html', dst: 'contacts/index.html' },
  { src: 'projects/index.html', dst: 'projects/index.html' },
  { src: 'donate/index.html', dst: 'donate/index.html' },
  { src: 'privacy/index.html', dst: 'privacy/index.html' },
];

function toTemplate(html) {
  let out = html;

  // Normalize asset paths to absolute
  out = out.replace(/href="\.\.\/css\//g, 'href="/css/');
  out = out.replace(/src="\.\.\/js\//g, 'src="/js/');
  out = out.replace(/href="\.\.\/images\//g, 'href="/images/');
  out = out.replace(/href="css\//g, 'href="/css/');
  out = out.replace(/href="\{\{L\}\}\/manifest\.json"/g, 'href="/manifest.json"');
  out = out.replace(/href="\{\{L\}\}\/favicon\.ico"/g, 'href="/favicon.ico"');
  out = out.replace(
    /property="og:url" content="https:\/\/cyblight\.org\/"/,
    'property="og:url" content="{{canonical}}"'
  );

  // Locale-aware internal links (keep /dark/ and external URLs)
  out = out.replace(/href="\/(?!dark\/|images\/|css\/|js\/|#)([^"]*)"/g, 'href="{{L}}/$1"');
  out = out.replace(/href="\/"/g, 'href="{{L}}/"');

  out = out.replace(/lang="ru"/g, 'lang="{{htmlLang}}"');
  out = out.replace(/content="ru_RU"/g, 'content="{{ogLocale}}"');
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    '<link rel="canonical" href="{{canonical}}" />\n    {{hreflang}}'
  );

  // Language switcher
  out = out.replace(
    /<a href="#" class="header-link header-lang">[\s\S]*?<span class="header-label">русский<\/span>\s*<\/a>/,
    `<div class="header-lang-wrap">
              <button type="button" class="header-link header-lang" aria-haspopup="listbox" aria-expanded="false">
                <span class="icon-24">
                  <svg class="cl-language" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3.814 16.464a.501.501 0 00.65-.278L5.54 13.5h2.923l1.074 2.686a.5.5 0 00.928-.372l-3-7.5a.52.52 0 00-.928 0l-3 7.5a.5.5 0 00.278.65zM7 9.846L8.061 12.5H5.94zM6 7.5a.5.5 0 00.224-.053l2-1a.5.5 0 10-.448-.894l-2 1A.5.5 0 006 7.5zM11.75 14.25a2.025 2.025 0 001.75 2.25 2.584 2.584 0 001.482-.431c.039.088.07.152.075.162a.5.5 0 00.887-.461 4.654 4.654 0 01-.15-.368c.176-.168.359-.348.56-.548a11.374 11.374 0 001.92-2.652A1.55 1.55 0 0119 13.5a2.082 2.082 0 01-1.607 2.012.5.5 0 00.107.988.506.506 0 00.107-.012A3.055 3.055 0 0020 13.5a2.542 2.542 0 00-1.283-2.205c.16-.364.244-.6.255-.63a.5.5 0 10-.944-.33 7.97 7.97 0 01-.225.552 5.11 5.11 0 00-2.482-.21c.04-.428.091-.845.153-1.229 1.427-.123 3.04-.44 3.124-.458a.5.5 0 00-.196-.98c-.019.003-1.43.283-2.736.418.162-.761.31-1.273.313-1.284a.5.5 0 10-.958-.288c-.016.053-.206.695-.393 1.64-.041 0-.088.004-.128.004h-2a.5.5 0 000 1h1.955c-.072.476-.134.985-.17 1.517a4.001 4.001 0 00-2.535 3.233zm1.75 1.25c-.362 0-.75-.502-.75-1.25a2.82 2.82 0 011.506-2.094 11.674 11.674 0 00.384 2.927 1.684 1.684 0 01-1.14.417zm2.604-3.897a4.4 4.4 0 011.251.193 10.325 10.325 0 01-1.708 2.35l-.163.162A11.04 11.04 0 0115.25 12c0-.093.008-.185.01-.278a3.318 3.318 0 01.844-.12z M22.5 3h-21a.5.5 0 00-.5.5v16a.5.5 0 00.5.5H10v3.5a.5.5 0 00.854.354L14.707 20H22.5a.5.5 0 00.5-.5v-16a.5.5 0 00-.5-.5zM22 19h-7.5a.5.5 0 00-.354.146L11 22.293V19.5a.5.5 0 00-.5-.5H2V4h20z"></path>
                  </svg>
                </span>
                <span class="header-label" data-lang-label>{{t.lang.current}}</span>
              </button>
              <ul class="header-lang-menu" role="listbox" hidden>
                <li><a href="/ru/" data-locale-link="ru" hreflang="ru">Русский</a></li>
                <li><a href="/uk/" data-locale-link="uk" hreflang="uk">Українська</a></li>
                <li><a href="/en/" data-locale-link="en" hreflang="en">English</a></li>
              </ul>
            </div>`
  );

  // Locale scripts before other deferred scripts
  if (!out.includes('strings-{{lang}}.js')) {
    out = out.replace(
      /(<script src="\/js\/report\.js" defer><\/script>)/,
      '<script src="/js/strings-{{lang}}.js"></script>\n    <script src="/js/i18n.js" defer></script>\n    $1'
    );
  }

  return out;
}

for (const { src, dst } of PAGES) {
  const srcPath = path.join(ROOT, src);
  const dstPath = path.join(ROOT, 'templates', dst);
  if (!fs.existsSync(srcPath)) {
    console.warn('Skip missing:', src);
    continue;
  }
  const html = fs.readFileSync(srcPath, 'utf8');
  fs.mkdirSync(path.dirname(dstPath), { recursive: true });
  fs.writeFileSync(dstPath, toTemplate(html), 'utf8');
  console.log('Template:', dst);
}
