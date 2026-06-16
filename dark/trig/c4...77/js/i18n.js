/** Locale strings for /dark/trig/c4...77/ */
const DARK_TRIGGER_STRINGS = {
  ru: {
    pageTitle: "404 — Страница не найдена",
    subtitle: "Кажется, такой страницы не существует.",
    textLine1: "Возможно, ты ошибся адресом.",
    textLine2: "Или просто заблудился в кибер-подсветке.",
    homeLink: "Вернуться на главную",
    peekLink: "заглянуть сюда.",
    nicknamePlaceholder: "Ваш Nickname",
    dialogOk: "OK",
    dialogCancel: "Отмена",
    easterTitle: "Поздравляю! Вы нашли пасхалку №1",
    promptSubtitle: "Введите ваше имя пользователя:",
    successMessage: "Неплохо для реакции! Пасхалка открыта — ",
  },
  uk: {
    pageTitle: "404 — Сторінку не знайдено",
    subtitle: "Схоже, такої сторінки не існує.",
    textLine1: "Можливо, ви помилилися адресою.",
    textLine2: "Або просто заблудилися в кібер-підсвітці.",
    homeLink: "Повернутися на головну",
    peekLink: "заглянути сюди.",
    nicknamePlaceholder: "Ваш Nickname",
    dialogOk: "OK",
    dialogCancel: "Скасувати",
    easterTitle: "Вітаю! Ви знайшли пасхалку №1",
    promptSubtitle: "Введіть ваше ім'я користувача:",
    successMessage: "Непогано для реакції! Пасхалку відкрито — ",
  },
  en: {
    pageTitle: "404 — Page not found",
    subtitle: "It looks like this page doesn't exist.",
    textLine1: "Maybe you mistyped the address.",
    textLine2: "Or got lost in the cyber glow.",
    homeLink: "Back to home",
    peekLink: "take a peek here.",
    nicknamePlaceholder: "Your nickname",
    dialogOk: "OK",
    dialogCancel: "Cancel",
    easterTitle: "Congrats! You found easter egg #1",
    promptSubtitle: "Enter your username:",
    successMessage: "Nice reaction time! Easter egg unlocked — ",
  },
};

function detectDarkTriggerLocale() {
  try {
    const stored = localStorage.getItem("cyblight-lang");
    if (stored && DARK_TRIGGER_STRINGS[stored]) return stored;
  } catch {}

  const ref = document.referrer || "";
  const fromRef = ref.match(/\/(ru|uk|en)(\/|$)/);
  if (fromRef) return fromRef[1];

  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("uk")) return "uk";
  if (nav.startsWith("en")) return "en";
  return "ru";
}

function dt(key) {
  const loc = window.DARK_TRIGGER_LOCALE || "ru";
  const pack = DARK_TRIGGER_STRINGS[loc] || DARK_TRIGGER_STRINGS.ru;
  return pack[key] != null ? pack[key] : key;
}

function homeHrefForLocale(locale) {
  if (locale === "ru") return "/ru/";
  return `/${locale}/`;
}

function applyDarkTriggerI18n() {
  const locale = detectDarkTriggerLocale();
  window.DARK_TRIGGER_LOCALE = locale;
  document.documentElement.lang = locale === "uk" ? "uk" : locale;
  document.title = dt("pageTitle");

  const subtitle = document.getElementById("errorSubtitle");
  if (subtitle) subtitle.textContent = dt("subtitle");

  const line1 = document.getElementById("errorLine1");
  if (line1) line1.textContent = dt("textLine1");

  const line2 = document.getElementById("errorLine2");
  if (line2) line2.textContent = dt("textLine2");

  const home = document.getElementById("linkHome");
  if (home) {
    home.href = homeHrefForLocale(locale);
    const label = home.querySelector(".link-home-label");
    if (label) label.textContent = dt("homeLink");
  }

  const peek = document.getElementById("msgLink");
  if (peek) peek.textContent = dt("peekLink");

  const input = document.getElementById("promptInput");
  if (input) input.placeholder = dt("nicknamePlaceholder");

  const ok = document.getElementById("confirmBtn");
  if (ok) ok.textContent = dt("dialogOk");

  const cancel = document.getElementById("cancelBtn");
  if (cancel) cancel.textContent = dt("dialogCancel");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyDarkTriggerI18n);
} else {
  applyDarkTriggerI18n();
}

window.DARK_TRIGGER_I18N = { dt, detectDarkTriggerLocale, homeHrefForLocale };
