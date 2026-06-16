const API_BASE = 'https://cyblight-backend.onrender.com';

function t(key) {
  const s = window.CYB_STRINGS || {};
  return s[key] != null ? s[key] : key;
}

function localeTag() {
  return (window.CYB_STRINGS && window.CYB_LOCALE === 'uk')
    ? 'uk-UA'
    : window.CYB_LOCALE === 'en'
      ? 'en-US'
      : 'ru-RU';
}

function loginUrl(path) {
  if (window.CYB_I18N && typeof window.CYB_I18N.loginUrl === 'function') {
    return window.CYB_I18N.loginUrl(path);
  }
  const locale = window.CYB_LOCALE || 'ru';
  const clean = String(path || 'username').replace(/^\/+/, '');
  return `https://login.cyblight.org/${locale}/${clean}`;
}

function clearUsageStats() {
  const wrap = document.getElementById('headerOnline');
  if (wrap) wrap.hidden = true;

  const resetText = t('unavailable');
  ['yt-subs', 'yt-videos', 'yt-tech-subs', 'yt-tech-videos'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = resetText;
  });
}

async function loadYoutubeStats() {
  if (window.CybPrivacy && !window.CybPrivacy.allows('usage')) {
    clearUsageStats();
    return;
  }
  // Основной канал
  try {
    const res = await fetch(`${API_BASE}/api/youtube/stats?channel=main`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    const subsEl = document.getElementById('yt-subs');
    if (subsEl && data.subscriberCount) {
      subsEl.textContent = Number(data.subscriberCount).toLocaleString(localeTag());
    }
    const videosEl = document.getElementById('yt-videos');
    if (videosEl && data.videoCount) {
      videosEl.textContent = Number(data.videoCount).toLocaleString(localeTag());
    }
  } catch (e) {
    console.error(e);
    const subsEl = document.getElementById('yt-subs');
    if (subsEl) subsEl.textContent = t('unavailable');
    const videosEl = document.getElementById('yt-videos');
    if (videosEl) videosEl.textContent = t('unavailable');
  }

  // Техно канал
  try {
    const res = await fetch(`${API_BASE}/api/youtube/stats?channel=tech`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    const techEl = document.getElementById('yt-tech-subs');
    if (techEl && data.subscriberCount) {
      techEl.textContent = Number(data.subscriberCount).toLocaleString(localeTag());
    }
    const techVideosEl = document.getElementById('yt-tech-videos');
    if (techVideosEl && data.videoCount) {
      techVideosEl.textContent = Number(data.videoCount).toLocaleString(localeTag());
    }
  } catch (e) {
    console.error(e);
    const techEl = document.getElementById('yt-tech-subs');
    if (techEl) techEl.textContent = t('unavailable');
    const techVideosEl = document.getElementById('yt-tech-videos');
    if (techVideosEl) techVideosEl.textContent = t('unavailable');
  }
}

async function loadOnlineCount() {
  if (window.CybPrivacy && !window.CybPrivacy.allows('usage')) {
    clearUsageStats();
    return;
  }
  const wrap = document.getElementById('headerOnline');
  const countEl = document.getElementById('headerOnlineCount');
  if (!wrap || !countEl) return;

  try {
    const res = await fetch('https://api.cyblight.org/stats/online');
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || !data.ok) return;

    countEl.textContent = Number(data.online || 0).toLocaleString(localeTag());
    wrap.hidden = false;
  } catch {
    // Если API недоступен — счётчик просто не показываем
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadYoutubeStats();
  loadOnlineCount();
  setInterval(loadOnlineCount, 60000);
});

window.addEventListener('cyblight-privacy-change', () => {
  if (window.CybPrivacy && !window.CybPrivacy.allows('usage')) {
    clearUsageStats();
    return;
  }
  loadYoutubeStats();
  loadOnlineCount();
});

(async () => {
  try {
    const res = await fetch('https://api.cyblight.org/auth/me', { credentials: 'include' });
    const data = await res.json().catch(() => null);

    const btn = document.querySelector('#loginBtn');
    if (!btn) return;

    const label = btn.querySelector('.header-label') || btn;

    if (res.ok && data && data.ok) {
      label.textContent = t('profile');
      btn.href = loginUrl('account-profile');
      btn.classList.add('is-profile');
    } else {
      label.textContent = t('login');
      btn.href = loginUrl('username');
      btn.classList.remove('is-profile');
    }
  } catch {}
})();

// projects carousel auto-scroll and navigation
(function () {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  // determine a step amount equal to one slide's width
  let running = true;
  function getScrollStep() {
    const firstCard = carousel.querySelector('.project-card');
    return firstCard
      ? firstCard.offsetWidth + parseFloat(getComputedStyle(firstCard).marginRight || 0)
      : carousel.clientWidth;
  }
  const interval = setInterval(() => {
    if (!running) return;
    const step = getScrollStep();
    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: step, behavior: 'smooth' });
    }
  }, 5000);
  carousel.addEventListener('mouseenter', () => (running = false));
  carousel.addEventListener('mouseleave', () => (running = true));

  // navigation buttons
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  function updateNav() {
    if (prevBtn) prevBtn.style.display = carousel.scrollLeft <= 0 ? 'none' : 'flex';
    if (nextBtn)
      nextBtn.style.display =
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1 ? 'none' : 'flex';
  }
  function scrollByStep(amount) {
    const step = getScrollStep();
    carousel.scrollBy({ left: amount * step, behavior: 'smooth' });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      running = false;
      scrollByStep(-1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      running = false;
      scrollByStep(1);
    });
  }
  // update when user scrolls manually
  carousel.addEventListener('scroll', updateNav);
  // initial state
  updateNav();
})();

// Site search — fullscreen overlay with word-by-word matching & highlighting
(function () {
  const L = '/' + (window.CYB_LOCALE || 'ru');
  function localizeSearchUrl(url) {
    if (!url || /^https?:\/\//.test(url) || /^\/(ru|uk|en)\//.test(url)) return url;
    const path = url.startsWith('/') ? url : '/' + url;
    return L + (path === '/' ? '/' : path);
  }

  const rawSearchIndex = (window.CYB_STRINGS && window.CYB_STRINGS.searchIndex) || [
    {
      title: 'Главная',
      desc: 'Основная страница CybLight. Добро пожаловать на сайт!',
      tags: ['главная', 'home', 'cyblight'],
      url: L + '/',
    },
    {
      title: 'Проекты',
      desc: 'Все проекты: сайт, Android-приложение, бот, умный дом, эхолот, Priority Manager X',
      tags: ['проекты', 'projects', 'портфолио'],
      url: L + '/projects/',
    },
    {
      title: 'Видео',
      desc: 'YouTube видео с каналов CybLight — геймплей и обзоры технологий',
      tags: ['видео', 'youtube', 'ролики'],
      url: L + '/#videos',
    },
    {
      title: 'Игры по программированию',
      desc: 'Интерактивные игры: угадай вывод кода, практика синтаксиса, алгоритмы',
      tags: ['игры', 'games', 'программирование', 'код'],
      url: L + '/games/',
    },
    {
      title: 'Контакты',
      desc: 'Почта, Telegram, YouTube, GitHub — все способы связаться',
      tags: ['контакты', 'contacts', 'связь', 'email', 'telegram'],
      url: L + '/contacts/',
    },
    {
      title: 'Приложение CybLight',
      desc: 'Мобильное приложение для Android — скачать APK, друзья, сообщения',
      tags: ['приложение', 'android', 'apk', 'mobile', 'app', 'скачать'],
      url: L + '/downloads/',
    },
    {
      title: 'Пожертвовать',
      desc: 'Поддержать развитие CybLight — донат, помощь проекту',
      tags: ['донат', 'donate', 'поддержка'],
      url: L + '/donate/',
    },
    {
      title: 'Условия использования',
      desc: 'Условия использования сайта CybLight и связанных сервисов',
      tags: ['условия', 'terms', 'правила'],
      url: L + '/terms/',
    },
    {
      title: 'Политика конфиденциальности',
      desc: 'Политика конфиденциальности и обработка данных',
      tags: ['конфиденциальность', 'privacy', 'данные'],
      url: L + '/privacy/',
    },
    {
      title: 'YouTube каналы',
      desc: 'Техно и Game каналы CybLight, подписчики, количество видео',
      tags: ['youtube', 'каналы', 'подписчики'],
      url: L + '/#projects',
    },
    {
      title: 'Сайт CybLight',
      desc: 'Основной сайт — HTML, CSS, JavaScript, TypeScript',
      tags: ['сайт', 'web', 'html', 'css', 'javascript', 'typescript'],
      url: L + '/projects/',
    },
    {
      title: 'Telegram-бот Guardian',
      desc: 'Python бот для модерации и поддержания порядка в Telegram-группах',
      tags: ['бот', 'telegram', 'python', 'guardian', 'модерация'],
      url: L + '/projects/',
    },
    {
      title: 'CybLight для Android',
      desc: 'Официальное мобильное приложение — аккаунт, друзья, сообщения, 2FA',
      tags: ['android', 'apk', 'kotlin', 'mobile', 'приложение'],
      url: L + '/downloads/',
    },
    {
      title: 'Priority Manager X',
      desc: 'C# приложение — управление приоритетами процессов в Windows',
      tags: ['priority', 'windows', 'c#', 'csharp', 'процессы'],
      url: L + '/projects/',
    },
    {
      title: 'Smart Home Hub',
      desc: 'Arduino и C++ — умный дом, автоматизация, IoT',
      tags: ['arduino', 'c++', 'умный дом', 'smart home', 'iot'],
      url: L + '/projects/',
    },
    {
      title: 'Fish Finder PRO',
      desc: 'Эхолот для рыбалки на базе Arduino — самодельная рыболовная электроника',
      tags: ['arduino', 'эхолот', 'рыбалка', 'fish finder'],
      url: L + '/projects/',
    },
  ];

  const searchIndex = rawSearchIndex.map((item) => ({
    ...item,
    url: localizeSearchUrl(item.url),
  }));

  // Динамически создаём оверлей поиска, чтобы он работал на всех страницах
  function createOverlay() {
    var el = document.getElementById('search-overlay');
    if (el) return el;

    el = document.createElement('div');
    el.className = 'search-overlay';
    el.id = 'search-overlay';
    el.innerHTML =
      '<div class="search-overlay-header">' +
      '<div class="search-overlay-input-wrap">' +
      '<svg class="search-overlay-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">' +
      '<path fill="currentColor" d="M23.354 22.646l-5-5-.012-.007a8.532 8.532 0 10-.703.703l.007.012 5 5a.5.5 0 00.707-.707zM12 19.5a7.5 7.5 0 117.5-7.5 7.508 7.508 0 01-7.5 7.5z"></path>' +
      '</svg>' +
      '<input id="search-overlay-input" type="text" placeholder="' + t('searchPlaceholderOverlay') + '" autocomplete="off" />' +
      '<button id="search-overlay-close" type="button" aria-label="' + t('searchClose') + '">\u2715</button>' +
      '</div>' +
      '<div class="search-overlay-meta" id="search-meta"></div>' +
      '</div>' +
      '<div class="search-overlay-results" id="search-overlay-results"></div>';
    document.body.appendChild(el);
    return el;
  }

  var overlay = createOverlay();
  var overlayInput = document.getElementById('search-overlay-input');
  var overlayResults = document.getElementById('search-overlay-results');
  var overlayMeta = document.getElementById('search-meta');
  var closeBtn = document.getElementById('search-overlay-close');

  // Находим поле и кнопку поиска в шапке по CSS-селектору (работает на любой странице)
  var searchBox = document.querySelector('.search-box');
  var headerInput = searchBox ? searchBox.querySelector('input') : null;
  var searchBtn = searchBox ? searchBox.querySelector('button') : null;

  function openSearch(query) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlayInput.value = query || '';
    overlayInput.focus();
    if (query) performSearch(query);
  }

  function closeSearch() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (headerInput) headerInput.value = '';
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightText(text, words) {
    if (!words.length) return escapeHtml(text);
    const pattern = words.map(escapeRegex).join('|');
    const regex = new RegExp('(' + pattern + ')', 'gi');
    return escapeHtml(text).replace(regex, '<mark class="search-hl">$1</mark>');
  }

  function scoreItem(item, words) {
    let score = 0;
    const title = item.title.toLowerCase();
    const desc = item.desc.toLowerCase();
    const tagStr = item.tags.join(' ').toLowerCase();

    for (const w of words) {
      if (title.includes(w)) score += 10;
      if (title.startsWith(w)) score += 5;
      if (tagStr.includes(w)) score += 6;
      if (desc.includes(w)) score += 3;
    }
    return score;
  }

  function performSearch(query) {
    overlayResults.innerHTML = '';
    const trimmed = query.trim();
    if (!trimmed) {
      overlayMeta.textContent = '';
      return;
    }

    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);

    // Стандартный поиск по searchIndex
    const scored = searchIndex
      .map((item) => ({ item, score: scoreItem(item, words) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    // Поиск по DOM для любой страницы
    let domResults = [];
    const path = window.location.pathname;
    const contentNodes = Array.from(
      document.querySelectorAll('.page, .page-frame, main, article, .content, .container')
    );
    let pageText = '';
    contentNodes.forEach((node) => {
      if (node) pageText += ' ' + node.innerText;
    });
    pageText = pageText.trim();
    if (pageText) {
      let found = false;
      for (const w of words) {
        if (pageText.toLowerCase().includes(w)) found = true;
      }
      if (found) {
        domResults.push({
          title: t('searchPageText'),
          desc: highlightText(pageText.slice(0, 300) + (pageText.length > 300 ? '...' : ''), words),
          tags: [t('searchTagPage'), t('searchTagText')],
          url: path,
        });
      }
    }

    // Объединяем результаты
    const allResults = [...domResults, ...scored.map((s) => s.item)];
    overlayMeta.textContent = allResults.length ? t('searchResults') + allResults.length : '';

    if (allResults.length === 0) {
      overlayResults.innerHTML =
        '<div class="search-no-results">' +
        '<div class="search-no-icon">🔍</div>' +
        '<p>' + t('searchNoResults') + ' ' +
        escapeHtml(trimmed) + '</p>' +
        '</div>';
      return;
    }

    // Выводим все результаты
    allResults.forEach((item, i) => {
      const a = document.createElement('a');
      a.href = item.url;
      a.className = 'search-result-item';
      a.style.animationDelay = i * 0.05 + 's';

      const tagsHtml = item.tags
        .map((t) => '<span class="search-tag">' + escapeHtml(t) + '</span>')
        .join('');

      a.innerHTML =
        '<div class="search-result-title">' +
        highlightText(item.title, words) +
        '</div>' +
        '<div class="search-result-desc">' +
        (item.desc || '') +
        '</div>' +
        '<div class="search-result-tags">' +
        tagsHtml +
        '</div>' +
        '<div class="search-result-url">' +
        escapeHtml(item.url) +
        '</div>';

      a.addEventListener('click', closeSearch);
      overlayResults.appendChild(a);
    });
  }

  // Open overlay on search button or Enter in header input
  if (searchBtn) {
    searchBtn.addEventListener('click', () => openSearch(headerInput ? headerInput.value : ''));
  }

  if (headerInput) {
    headerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        openSearch(headerInput.value);
      }
    });
  }

  // Close overlay
  closeBtn.addEventListener('click', closeSearch);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });

  // Real-time search inside overlay
  overlayInput.addEventListener('input', () => performSearch(overlayInput.value));

  overlayInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    if (e.key === 'Enter') performSearch(overlayInput.value);
  });

  // Keyboard shortcut: Ctrl+K to open search
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch('');
    }
  });
})();
