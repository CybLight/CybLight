const API_BASE = 'https://cyblight-backend.onrender.com';

async function loadYoutubeStats() {
  // Основной канал
  try {
    const res = await fetch(`${API_BASE}/api/youtube/stats?channel=main`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    const subsEl = document.getElementById('yt-subs');
    if (subsEl && data.subscriberCount) {
      subsEl.textContent = Number(data.subscriberCount).toLocaleString('ru-RU');
    }
  } catch (e) {
    console.error(e);
    const subsEl = document.getElementById('yt-subs');
    if (subsEl) subsEl.textContent = 'недоступно';
  }

  // Техно канал
  try {
    const res = await fetch(`${API_BASE}/api/youtube/stats?channel=tech`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    const techEl = document.getElementById('yt-tech-subs');
    if (techEl && data.subscriberCount) {
      techEl.textContent = Number(data.subscriberCount).toLocaleString('ru-RU');
    }
  } catch (e) {
    console.error(e);
    const techEl = document.getElementById('yt-tech-subs');
    if (techEl) techEl.textContent = 'недоступно';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadYoutubeStats();
});

(async () => {
  try {
    const res = await fetch('https://api.cyblight.org/auth/me', { credentials: 'include' });
    const data = await res.json().catch(() => null);

    const btn = document.querySelector('#loginBtn');
    if (!btn) return;

    const label = btn.querySelector('.header-label') || btn;

    if (res.ok && data && data.ok) {
      label.textContent = 'Профиль';
      btn.href = 'https://login.cyblight.org/account-profile';
      btn.classList.add('is-profile');
    } else {
      label.textContent = 'Войти';
      btn.href = 'https://login.cyblight.org/';
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
