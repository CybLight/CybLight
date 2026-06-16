(function () {
  const GITHUB_RELEASES =
    "https://github.com/CybLight/CybLight-Android/releases/latest";
  const GITHUB_API =
    "https://api.github.com/repos/CybLight/CybLight-Android/releases/latest";

  async function init() {
    const githubApkBtn = document.getElementById("downloadGithubApkBtn");
    const githubLink = document.getElementById("downloadGithubLink");
    const versionBadge = document.getElementById("appVersionBadge");

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
