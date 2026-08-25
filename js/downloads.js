(function () {
  const GITHUB_RELEASES =
    "https://github.com/CybLight/CybLight-Android/releases/latest";
  const GITHUB_API =
    "https://api.github.com/repos/CybLight/CybLight-Android/releases/latest";

  function detectOS() {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
    if (/windows/i.test(ua)) return 'windows';
    if (/macintosh|mac os x/i.test(ua)) return 'mac';
    if (/linux/i.test(ua)) return 'linux';
    return 'other';
  }

  async function init() {
    const githubApkBtn = document.getElementById("downloadGithubApkBtn");
    const githubLink = document.getElementById("downloadGithubLink");
    const versionBadge = document.getElementById("appVersionBadge");
    const heroText = document.querySelector(".downloads-version");

    const os = detectOS();
    const qrBox = document.getElementById("desktopQrBox");
    const qrImage = document.getElementById("qrImage");

    if (os === 'android' && githubApkBtn) {
      githubApkBtn.classList.add('downloads-btn--highlight');
      if (heroText && !document.getElementById('osBadge')) {
        const badge = document.createElement('span');
        badge.id = 'osBadge';
        badge.className = 'os-detected-badge';
        badge.textContent = ' • Ваша система: Android ✓';
        heroText.appendChild(badge);
      }
    } else if (['windows', 'mac', 'linux', 'other'].includes(os) && qrBox) {
      qrBox.style.display = 'flex';
    }

    if (githubLink) githubLink.href = GITHUB_RELEASES;


    try {
      const res = await fetch(GITHUB_API, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (res.ok) {
        const data = await res.json();
        const asset = (data.assets || []).find(
          (item) => item.name && /\.apk$/i.test(item.name),
        );
        if (asset && asset.browser_download_url && githubApkBtn) {
          githubApkBtn.href = asset.browser_download_url;
        }
        if (githubLink && data.html_url) githubLink.href = data.html_url;
        if (versionBadge && data.tag_name) {
          versionBadge.textContent = String(data.tag_name).replace(/^v/i, "");
        }
      }
    } catch (_) {
      /* GitHub API optional */
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

