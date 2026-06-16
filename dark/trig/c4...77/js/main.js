const BUS_IMAGE_URL = "./media/dark-trigger.jpg";
const LOG_URL = "https://cyblight.org/e-log";
const API_BASE = "https://api.cyblight.org";
const DARK_TRIGGER_KEY = "cyb_dark_trigger_unlocked";

function dt(key) {
  if (window.DARK_TRIGGER_I18N && typeof window.DARK_TRIGGER_I18N.dt === "function") {
    return window.DARK_TRIGGER_I18N.dt(key);
  }
  return key;
}

let Unlocked = false;

function customPrompt(title, subtitle) {
  return new Promise((resolve) => {
    const modal = document.getElementById("customPrompt");
    const input = document.getElementById("promptInput");
    const ok = document.getElementById("confirmBtn");
    const cancel = document.getElementById("cancelBtn");

    const titleEl = modal.querySelector(".title");
    const textEl = modal.querySelector(".subtitle");

    if (titleEl) titleEl.textContent = title || "";
    if (textEl) textEl.textContent = subtitle || "";

    modal.style.display = "flex";
    input.value = "";
    input.focus();

    const cleanup = () => {
      modal.style.display = "none";
      ok.onclick = null;
      cancel.onclick = null;
    };

    ok.onclick = () => {
      const val = input.value;
      cleanup();
      resolve(val || "");
    };

    cancel.onclick = () => {
      cleanup();
      resolve("");
    };
  });
}

function sendWorkLog(extra = {}) {
  if (window.CybPrivacy && !window.CybPrivacy.allows("diagnostic")) return;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const payload = {
    type: "nice_click",
    page: window.location.href,
    timezone: tz,
    ...extra,
  };

  fetch(LOG_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

async function checkIfLoggedIn() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json().catch(() => null);
    return !!(res.ok && data?.ok);
  } catch (e) {
    return false;
  }
}

async function saveDarkTriggerToServer() {
  try {
    const res = await fetch(`${API_BASE}/auth/easter/dark-trigger`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    console.log("🌑 Dark Trigger server response:", {
      ok: res.ok,
      status: res.status,
      data: data,
    });
    return res.ok;
  } catch (e) {
    console.error("❌ Failed to save dark trigger:", e);
    return false;
  }
}

function spawnOrb() {
  if (Unlocked) return;

  const orb = document.createElement("div");
  orb.className = "falling-orb";

  const vw = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  const leftPx = 40 + Math.random() * (vw - 80);
  orb.style.left = leftPx + "px";

  document.body.appendChild(orb);

  orb.addEventListener("animationend", () => {
    orb.remove();
  });

  orb.addEventListener("click", async () => {
    if (Unlocked) return;

    let storedName = (localStorage.getItem("itemUserName") || "").trim();

    while (!storedName) {
      const input = await customPrompt(dt("easterTitle"), dt("promptSubtitle"));

      if (!input || !input.trim()) {
        // чтобы шарик мог снова сработать позже
        Unlocked = false;
        return;
      }

      storedName = input.trim();
      localStorage.setItem("itemUserName", storedName);
    }

    Unlocked = true;
    orb.remove();

    // Сохраняем флаг локально
    localStorage.setItem(DARK_TRIGGER_KEY, "1");
    console.log("🌑 Dark Trigger flag set in localStorage");

    sendWorkLog({
      userName: storedName || null,
    });

    // Проверяем авторизацию и отправляем на сервер
    const isLoggedIn = await checkIfLoggedIn();
    if (isLoggedIn) {
      console.log("🌑 User is logged in, saving to server...");
      await saveDarkTriggerToServer();
    } else {
      console.log("🌑 User not logged in, flag saved locally for later");
    }

    const msg = document.getElementById("serviceMessage");
    if (msg) {
      msg.style.display = "block";
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const msgText = document.querySelector(".msg-text");
    if (msgText) {
      msgText.textContent = dt("successMessage");
    }

    window.open(BUS_IMAGE_URL, "_blank", "noopener");
  });
}

setTimeout(spawnOrb, 2000);

const interval = setInterval(() => {
  if (Unlocked) {
    clearInterval(interval);
    return;
  }
  spawnOrb();
}, 10000 + Math.random() * 8000);
