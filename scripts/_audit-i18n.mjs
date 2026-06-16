import fs from 'fs';

const PAGES = [
  'index.html', 'games/index.html', 'contacts/index.html', 'projects/index.html',
  'downloads/index.html', 'donate/index.html', 'privacy/index.html', 'terms/index.html',
];
const hasCyr = (s) => /[А-Яа-яЁё]/.test(s);

// Extract visible text segments between > and < (skip tags/attrs/scripts)
function segments(html) {
  const out = [];
  const re = />([^<]+)</g;
  let m;
  while ((m = re.exec(html))) {
    const t = m[1].replace(/\s+/g, ' ').trim();
    if (t && hasCyr(t)) out.push(t);
  }
  return out;
}

for (const loc of ['en', 'uk']) {
  console.log(`\n========== LOCALE: ${loc} ==========`);
  for (const page of PAGES) {
    const ruText = fs.readFileSync(`ru/${page}`, 'utf8');
    const locText = fs.readFileSync(`${loc}/${page}`, 'utf8');
    const ruSegs = new Set(segments(ruText));
    const locSegs = segments(locText);
    // Untranslated = a segment that is identical in ru and loc (verbatim Russian survived)
    const missing = [...new Set(locSegs.filter((s) => ruSegs.has(s)))];
    // Drop the intentional language-switcher label "Русский"
    const real = missing.filter((s) => s !== 'Русский');
    if (real.length) {
      console.log(`\n  --- ${page} (${real.length}) ---`);
      real.forEach((s) => console.log('    ' + JSON.stringify(s)));
    }
  }
}
