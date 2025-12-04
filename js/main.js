const API_BASE = "https://cyblight-backend.onrender.com";

async function loadYoutubeStats() {
  try {
    const res = await fetch(`${API_BASE}/api/youtube/stats`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    const subsEl = document.getElementById("yt-subs");
    if (subsEl && data.subscriberCount) {
      subsEl.textContent = Number(data.subscriberCount).toLocaleString("ru-RU");
    }
  } catch (e) {
    console.error(e);
    const subsEl = document.getElementById("yt-subs");
    if (subsEl) subsEl.textContent = "недоступно";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadYoutubeStats();
});
