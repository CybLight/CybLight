let audioCtx = null;

function playTick() {
  try {
    // создаём контекст при первом клике (жест пользователя)
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // если контекст “уснул” — пробуждаем
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;

    // Осциллятор = сам “тик”
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1700, t); // высота “тика”

    // Громкость с огибающей (очень коротко)
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.005); // атака
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04); // затухание

    // лёгкий фильтр, чтобы не резало ухо
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(650, t);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  } catch (e) {
    // тихо игнорируем
  }
}

// ===== Toast (один на страницу) =====
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);

let toastTimer = null;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1600);
}

// ===== КРАСИВОЕ КОПИРОВАНИЕ =====
async function copyText(text, btn = null) {
  try {
    await navigator.clipboard.writeText(text);

    // 🔊 звук
    playTick();

    // Tooltip: "Скопировать" → "Скопировано"
    if (btn) {
      const prev = btn.getAttribute('data-tooltip') || 'Скопировать';
      btn.setAttribute('data-tooltip', 'Скопировано ✅');
      btn.classList.add('copied');

      setTimeout(() => {
        btn.setAttribute('data-tooltip', prev);
        btn.classList.remove('copied');
      }, 1200);
    }

    showToast('Скопировано ✅');
  } catch (err) {
    showToast('Не удалось скопировать 😕');
  }
}

(function jarWidgetFX() {
  const btn = document.querySelector('.donate-btn');      // ссылка на монобанк
  const widget = document.querySelector('.jar-widget');   // виджет банки
  const jar = widget?.querySelector('.jar-jar');          // кликабельная банка
  const coinsLayer = widget?.querySelector('.jar-coins'); // слой монет
  const liquid = widget?.querySelector('.jar-liquid');    // заливка (может не использоваться напрямую)
  if (!widget || !jar || !coinsLayer || !liquid) return;

  // =========================
  // Fill 0..1
  // =========================
  let fill = 0.12;
  function setFill(v) {
    fill = Math.max(0.08, Math.min(1, v));
    jar.style.setProperty('--fill', fill.toFixed(3));
  }
  setFill(fill);

  // лёгкое “оседание” назад
  let decayTimer = null;
  function startDecay() {
    if (decayTimer) return;
    decayTimer = setInterval(() => {
      setFill(fill - 0.003);
      if (fill <= 0.1) {
        clearInterval(decayTimer);
        decayTimer = null;
      }
    }, 250);
  }

  // =========================
  // Sound “дзынь”
  // =========================
  let audioCtx = null;
  let lastDingAt = 0;

  function playDing() {
    const now = performance.now();
    if (now - lastDingAt < 160) return;
    lastDingAt = now;

    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const t = audioCtx.currentTime;

      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(980, t);
      osc1.frequency.exponentialRampToValueAtTime(760, t + 0.1);

      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1960, t);
      osc2.frequency.exponentialRampToValueAtTime(1520, t + 0.08);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.14, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(520, t);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.23);
      osc2.stop(t + 0.18);
    } catch (e) {}
  }

  // =========================
  // Spawn coin inside jar widget
  // =========================
  function spawnCoin({ burst = false } = {}) {
    const coin = document.createElement('span');
    coin.className = 'coin';
    coin.textContent = '🪙';

    // Внутри банки: целимся в горлышко
    const x = 48 + (Math.random() * 16 - 8); // 40..56%
    const y = -10;

    const drop = 40 + Math.random() * 10;   // 40..50px
    const dur = burst ? 520 + Math.random() * 120 : 680 + Math.random() * 160;

    coin.style.setProperty('--x', `${x}%`);
    coin.style.setProperty('--y', `${y}px`);
    coin.style.setProperty('--drop', `${drop}px`);
    coin.style.setProperty('--dur', `${dur.toFixed(0)}ms`);

    coinsLayer.appendChild(coin);

    // звук + наполнение
    playDing();
    setFill(fill + (burst ? 0.035 : 0.012));
    startDecay();

    coin.addEventListener('animationend', () => coin.remove(), { once: true });
  }

  // =========================
  // Modes: hold / tap on JAR (mobile friendly)
  // =========================
  let rain = null;

  function startRain(e) {
    // чтобы долгий тап не лез в “системные” действия
    if (e && e.cancelable) e.preventDefault();

    if (rain) return;
    spawnCoin({ burst: false });
    rain = setInterval(() => spawnCoin({ burst: false }), 120);
  }

  function stopRain() {
    if (!rain) return;
    clearInterval(rain);
    rain = null;
  }

  // ВАЖНО: блокируем контекст-меню на банке (Android long-press)
  jar.addEventListener('contextmenu', (e) => e.preventDefault());

  // Pointer (универсально)
  jar.addEventListener('pointerdown', startRain, { passive: false });
  window.addEventListener('pointerup', stopRain);
  window.addEventListener('pointercancel', stopRain);
  window.addEventListener('blur', stopRain);

  // Touch fallback
  jar.addEventListener('touchstart', startRain, { passive: false });
  jar.addEventListener('touchend', stopRain);
  jar.addEventListener('touchcancel', stopRain);

  // Короткий тап по банке = “всплеск”
  jar.addEventListener('click', (e) => {
    // на всякий: чтобы не было “двойного” эффекта после удержания
    if (rain) return;
    if (e && e.cancelable) e.preventDefault();
    for (let i = 0; i < 7; i++) setTimeout(() => spawnCoin({ burst: true }), i * 55);
  });

  // =========================
  // ПК: можно запускать дождь от hover по кнопке (но сама кнопка не трогается на мобилке)
  // =========================
  if (btn) {
    // hover только если есть “мышь”
    const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

    if (canHover) {
      btn.addEventListener('pointerenter', () => startRain());
      btn.addEventListener('pointerleave', stopRain);
    }

    // Клик по кнопке оставляем как переход по ссылке.
    // Если хочешь, чтобы при клике по кнопке был "всплеск" (и всё равно переход),
    // можно раскомментировать ниже:
    /*
    btn.addEventListener('click', () => {
      for (let i = 0; i < 6; i++) setTimeout(() => spawnCoin({ burst: true }), i * 45);
    });
    */
  }
})();