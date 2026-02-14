const API_BASE = 'https://cyblight-backend.onrender.com';

async function loadYoutubeStats() {
  try {
    const res = await fetch(`${API_BASE}/api/youtube/stats`);
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
