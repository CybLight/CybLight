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
  const saved = localStorage.getItem("theme");

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
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
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
