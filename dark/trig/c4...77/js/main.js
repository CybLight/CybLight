const SECRET_IMAGE_URL = "./media/dark-trigger.jpg";
const LOG_URL = "https://cyblight.org/egg-log";

let eggUnlocked = false;

function sendEggLog() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const payload = {
    type: "egg_click",
    page: window.location.href,
    timezone: tz,
  };

  fetch(LOG_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

function spawnOrb() {
  if (eggUnlocked) return;

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

  orb.addEventListener("click", () => {
    if (eggUnlocked) return;
    eggUnlocked = true;
    orb.remove();

    sendEggLog();

    const msg = document.getElementById("secretMessage");
    if (msg) {
      msg.style.display = "block";
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

setTimeout(spawnOrb, 2000);

const interval = setInterval(() => {
  if (eggUnlocked) {
    clearInterval(interval);
    return;
  }
  spawnOrb();
}, 10000 + Math.random() * 8000);
