// Скрипт для переключения темы
(function () {
  const body = document.body;
  const btn = document.getElementById("themeToggle");

  if (!btn) return;

  // читаем сохранённую тему
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    body.classList.add("dark");
    btn.textContent = "Светлая тема";
  } else {
    body.classList.remove("dark");
    btn.textContent = "Тёмная тема";
  }

  btn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    btn.textContent = isDark ? "Светлая тема" : "Тёмная тема";
    localStorage.setItem("theme", isDark ? "dark" : "light");
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
