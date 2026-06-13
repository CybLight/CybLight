(function () {
  const LOCALES = ['ru', 'uk', 'en'];

  function getLocaleFromPath() {
    const m = window.location.pathname.match(/^\/(ru|uk|en)(\/|$)/);
    return m ? m[1] : 'ru';
  }

  function pagePathWithoutLocale() {
    const path = window.location.pathname.replace(/^\/(ru|uk|en)/, '') || '/';
    return path.endsWith('/') ? path : path + '/';
  }

  function localeUrl(locale) {
    const page = pagePathWithoutLocale();
    if (page === '/') return '/' + locale + '/';
    return '/' + locale + page;
  }

  function t(key) {
    const strings = window.CYB_STRINGS || {};
    return strings[key] != null ? strings[key] : key;
  }

  function loginUrl(path) {
    const locale = getLocaleFromPath();
    const clean = String(path || 'username').replace(/^\/+/, '');
    return 'https://login.cyblight.org/' + locale + '/' + clean;
  }

  window.CYB_I18N = { t, getLocaleFromPath, localeUrl, loginUrl };

  // Language switcher
  document.addEventListener('DOMContentLoaded', () => {
    const locale = getLocaleFromPath();
    document.documentElement.lang = locale === 'uk' ? 'uk' : locale;

    document.querySelectorAll('[data-locale-link]').forEach((link) => {
      const target = link.getAttribute('data-locale-link');
      if (LOCALES.includes(target)) {
        link.href = localeUrl(target);
        link.addEventListener('click', () => {
          try {
            if (window.CybPrivacy && window.CybPrivacy.allows('functional')) {
              localStorage.setItem('cyblight-lang', target);
            }
          } catch {}
        });
      }
    });

    document.querySelectorAll('.header-lang-wrap').forEach((wrap) => {
      const btn = wrap.querySelector('.header-lang');
      const menu = wrap.querySelector('.header-lang-menu');
      if (!btn || !menu) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = menu.hasAttribute('hidden');
        document.querySelectorAll('.header-lang-menu').forEach((m) => m.setAttribute('hidden', ''));
        if (open) {
          menu.removeAttribute('hidden');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.header-lang-menu').forEach((m) => m.setAttribute('hidden', ''));
      document.querySelectorAll('.header-lang').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    });
  });
})();
