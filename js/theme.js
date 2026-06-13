// Скрипт для переключения темы
(function () {
  const body = document.body;
  const btn = document.getElementById("themeToggle");

  if (!btn) return;

  function t(key) {
    const s = window.CYB_STRINGS || {};
    return s[key] != null ? s[key] : key;
  }

  // читаем сохранённую тему
  const canStore = !window.CybPrivacy || window.CybPrivacy.allows('functional');
  const saved = canStore ? localStorage.getItem("theme") : null;

  if (saved === "dark") {
    body.classList.add("dark");
    btn.textContent = t("themeLight");
  } else {
    body.classList.remove("dark");
    btn.textContent = t("themeDark");
  }

  btn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    btn.textContent = isDark ? t("themeLight") : t("themeDark");
    if (!window.CybPrivacy || window.CybPrivacy.allows('functional')) {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
    if (typeof window.trackThemeFluxToggle === "function") {
      window.trackThemeFluxToggle();
    }
  });
})();

(function () {
  const THEME_FLUX_KEY = "cyb_theme_flux_unlocked";
  const API_BASE = "https://api.cyblight.org";
  const LOG_URL = "https://cyblight.org/e-log";
  const REQUIRED_TOGGLES = 6;
  const WINDOW_MS = 4000;

  if (localStorage.getItem(THEME_FLUX_KEY) === "1") return;

  let toggleTimes = [];
  let unlocking = false;
  let modalOpen = false;

  function t(key, fallback) {
    const s = window.CYB_STRINGS || {};
    return s[key] != null ? s[key] : fallback || key;
  }

  function sendThemeFluxLog(userName, extra = {}) {
    if (window.CybPrivacy && !window.CybPrivacy.allows('diagnostic')) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(LOG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "theme_flux",
        userName,
        source: "rapid_theme_toggle",
        route: "site/theme",
        page: window.location.href,
        timezone: tz,
        ua: navigator.userAgent,
        referrer: document.referrer || null,
        alex: 12,
        ...extra,
      }),
    }).catch(() => {});
  }

  function syncThemeFluxModalPosition(overlay) {
    const footer = document.querySelector("footer");
    const gap = 18;

    if (!footer) {
      overlay.style.paddingBottom = `${gap}px`;
      return;
    }

    const rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      overlay.style.paddingBottom = `${Math.max(gap, window.innerHeight - rect.top + gap)}px`;
    } else {
      overlay.style.paddingBottom = `${gap}px`;
    }
  }

  function showThemeFluxModal() {
    if (modalOpen) return;
    modalOpen = true;

    const overlay = document.createElement("div");
    overlay.className = "theme-flux-overlay";
    overlay.innerHTML = `
      <div class="theme-flux-modal" role="dialog" aria-modal="true">
        <div class="theme-flux-modal__orbit" aria-hidden="true">
          <span class="theme-flux-modal__moon">🌗</span>
        </div>
        <h2 class="theme-flux-modal__title">${t("themeFluxTitle", "Маятник")}</h2>
        <p class="theme-flux-modal__text">${t(
          "themeFluxText",
          "Ты раскачал сайт между светом и тьмой. Настроение поймано!"
        )}</p>
        <button type="button" class="theme-flux-modal__btn">${t(
          "themeFluxBtn",
          "Свет ↔ тьма ✦"
        )}</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("theme-flux-modal-open");
    syncThemeFluxModalPosition(overlay);

    const reposition = () => syncThemeFluxModalPosition(overlay);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, { passive: true });

    requestAnimationFrame(() => overlay.classList.add("is-visible"));

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;

      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition);
      document.body.classList.remove("theme-flux-modal-open");
      overlay.classList.remove("is-visible");
      overlay.addEventListener(
        "transitionend",
        () => {
          overlay.remove();
          modalOpen = false;
        },
        { once: true }
      );
    };

    overlay.querySelector(".theme-flux-modal__btn").addEventListener("click", close);
  }

  async function unlockThemeFlux() {
    if (unlocking || localStorage.getItem(THEME_FLUX_KEY) === "1") return;
    unlocking = true;
    localStorage.setItem(THEME_FLUX_KEY, "1");

    document.body.classList.add("theme-flux-celebrate");
    setTimeout(() => document.body.classList.remove("theme-flux-celebrate"), 1200);
    showThemeFluxModal();

    try {
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (meRes.ok) {
        const meData = await meRes.json().catch(() => ({}));
        const userName = meData?.user?.login;
        const hadBridge = meData?.user?.easter?.bridge === true;

        const saveRes = await fetch(`${API_BASE}/auth/easter/theme-flux`, {
          method: "POST",
          credentials: "include",
        });

        if (userName && saveRes.ok) {
          sendThemeFluxLog(userName);

          if (!hadBridge) {
            const meRes2 = await fetch(`${API_BASE}/auth/me`, {
              method: "GET",
              credentials: "include",
            });
            if (meRes2.ok) {
              const meData2 = await meRes2.json().catch(() => ({}));
              if (meData2?.user?.easter?.bridge === true) {
                sendThemeFluxLog(userName, {
                  type: "bridge",
                  source: "web_app_same_day",
                  alex: 9,
                });
              }
            }
          }
        }
      }
    } catch (_) {}
  }

  window.trackThemeFluxToggle = function trackThemeFluxToggle() {
    if (unlocking || modalOpen || localStorage.getItem(THEME_FLUX_KEY) === "1") return;

    const now = Date.now();
    toggleTimes.push(now);
    toggleTimes = toggleTimes.filter((ts) => now - ts <= WINDOW_MS);

    if (toggleTimes.length >= REQUIRED_TOGGLES) {
      toggleTimes = [];
      unlockThemeFlux();
    }
  };
})();

(function () {
  const trigger = document.querySelector(".dark-card .dark-trigger");
  if (!trigger) return;

  let clicks = 0;
  const REQUIRED = 77;
  const target = "/dark/trig/c4...77/";

  trigger.addEventListener("click", function (e) {
    e.stopPropagation();
    clicks++;

    if (clicks < REQUIRED) {
      trigger.textContent = `(${REQUIRED - clicks})`;
    }

    if (clicks >= REQUIRED) {
      trigger.textContent = (window.CYB_STRINGS && window.CYB_STRINGS.opening) || "Открываю...";
      setTimeout(() => {
        window.location.href = target;
      }, 500);
    }
  });
})();

// Скрипт для бургер-меню
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const body = document.body;

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      body.classList.toggle("nav-open");
    });
  }

  // Чтобы меню закрывалось после клика по пункту
  const menuLinks = document.querySelectorAll(".buttons a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
    });
  });
});

// === КНОПКА НАВЕРХ ===
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

document.querySelector(".nav-overlay").addEventListener("click", () => {
  document.body.classList.remove("nav-open");
});
