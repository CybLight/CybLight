const BUS_IMAGE_URL = "./media/dark-trigger.jpg";
const LOG_URL = "https://cyblight.org/e-log";

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

function sendEggLog(extra = {}) {
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

const __x0f = [
  1055, 1086, 1079, 1076, 1088, 1072, 1074, 1083, 1103, 1102, 33, 32, 1042,
  1099, 32, 1085, 1072, 1096, 1083, 1080, 32, 1087, 1072, 1089, 1093, 1072,
  1083, 1082, 1091, 32, 8470, 49,
]
  .map((q) => String.fromCharCode(q))
  .join("");

const __sv = [
  1053, 1077, 1087, 1083, 1086, 1093, 1086, 32, 1076, 1083, 1103, 32, 1088,
  1077, 1072, 1082, 1094, 1080, 1080, 33, 32, 1055, 1072, 1089, 1093, 1072,
  1083, 1082, 1072, 32, 1086, 1090, 1082, 1088, 1099, 1090, 1072, 32, 8212, 32,
]
  .map((c) => String.fromCharCode(c))
  .join("");

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
    Unlocked = true;
    orb.remove();

    let storedName = localStorage.getItem("itemUserName");
    if (!storedName) {
      storedName =
        (await customPrompt(__x0f, "Введите ваше имя пользователя:")) || "";
      if (storedName.trim()) {
        localStorage.setItem("itemUserName", storedName.trim());
      }
    }

    sendEggLog({
      userName: storedName || null,
    });

    const msg = document.getElementById("serviceMessage");
    if (msg) {
      msg.style.display = "block";
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    document.querySelector(".msg-text").textContent = __sv;

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
