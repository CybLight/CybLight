/** Lightweight alert dialog — replaces native alert() */
(function () {
  function t(key, fallback) {
    const s = window.CYB_STRINGS || {};
    return s[key] != null ? s[key] : fallback;
  }

  let modalEl = null;
  let resolveFn = null;

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove("is-open");
    document.body.classList.remove("cyb-dialog-open");
    if (resolveFn) {
      resolveFn();
      resolveFn = null;
    }
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "cybDialogModal";
    modalEl.className = "cyb-dialog-modal";
    modalEl.innerHTML = `
      <div class="cyb-dialog-modal__backdrop" aria-hidden="true"></div>
      <div class="cyb-dialog-modal__card" role="alertdialog" aria-modal="true" aria-labelledby="cybDialogMessage">
        <p id="cybDialogMessage" class="cyb-dialog-modal__message"></p>
        <div class="cyb-dialog-modal__actions">
          <button type="button" class="cyb-dialog-modal__btn" data-dialog-ok>${t("dialogOk", "OK")}</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    modalEl.querySelector(".cyb-dialog-modal__backdrop")?.addEventListener("click", closeModal);
    modalEl.querySelector("[data-dialog-ok]")?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
      if (!modalEl?.classList.contains("is-open")) return;
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        closeModal();
      }
    });

    return modalEl;
  }

  function alert(message) {
    return new Promise((resolve) => {
      const modal = ensureModal();
      resolveFn = resolve;

      modal.querySelector("#cybDialogMessage").textContent = String(message ?? "");
      const okBtn = modal.querySelector("[data-dialog-ok]");
      if (okBtn) okBtn.textContent = t("dialogOk", "OK");

      modal.classList.add("is-open");
      document.body.classList.add("cyb-dialog-open");
      okBtn?.focus();
    });
  }

  window.CybDialog = { alert };
})();
