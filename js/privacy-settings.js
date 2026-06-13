(function () {
  const STORAGE_KEY = 'cyblight-privacy-consent';

  function t(key, fallback) {
    const s = window.CYB_STRINGS || {};
    return s[key] != null ? s[key] : fallback || key;
  }

  function localePrefix() {
    return '/' + (window.CYB_LOCALE || 'ru');
  }

  function privacyCookiesUrl() {
    return localePrefix() + '/privacy/#cookies';
  }

  function privacyPolicyUrl() {
    return localePrefix() + '/privacy/';
  }

  function defaultOptional() {
    return { functional: false, diagnostic: false, usage: false };
  }

  function readStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return null;
      return {
        functional: !!data.functional,
        diagnostic: !!data.diagnostic,
        usage: !!data.usage,
        decided: true,
      };
    } catch {
      return null;
    }
  }

  function writeStored(consent) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        functional: !!consent.functional,
        diagnostic: !!consent.diagnostic,
        usage: !!consent.usage,
        savedAt: Date.now(),
      }),
    );
  }

  function getConsent() {
    const stored = readStored();
    if (stored) return stored;
    return { ...defaultOptional(), decided: false };
  }

  function allows(category) {
    if (category === 'necessary') return true;
    const consent = getConsent();
    if (!consent.decided) return false;
    return !!consent[category];
  }

  function applyPrivacyState() {
    document.documentElement.classList.toggle('cyb-privacy-no-usage', !allows('usage'));
    document.documentElement.classList.toggle('cyb-privacy-no-functional', !allows('functional'));
    document.documentElement.classList.toggle('cyb-privacy-no-diagnostic', !allows('diagnostic'));
  }

  function dispatchChange() {
    applyPrivacyState();
    window.dispatchEvent(new CustomEvent('cyblight-privacy-change', { detail: getConsent() }));
  }

  function saveConsent(partial) {
    writeStored({ ...defaultOptional(), ...partial });
    dispatchChange();
    hideBanner();
  }

  let modalEl = null;
  let bannerEl = null;

  function hideBanner() {
    if (!bannerEl) return;
    bannerEl.classList.remove('is-visible');
    document.body.classList.remove('cyb-privacy-banner-open');
  }

  function showBanner() {
    if (getConsent().decided) return;
    const banner = ensureBanner();
    banner.classList.add('is-visible');
    document.body.classList.add('cyb-privacy-banner-open');
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    document.body.classList.remove('cyb-privacy-modal-open');
    if (!getConsent().decided) showBanner();
  }

  function openModal() {
    hideBanner();
    const modal = ensureModal();
    const consent = getConsent();

    modal.querySelector('#cybPrivacyFunctional').checked = consent.functional;
    modal.querySelector('#cybPrivacyDiagnostic').checked = consent.diagnostic;
    modal.querySelector('#cybPrivacyUsage').checked = consent.usage;

    modal.classList.add('is-open');
    document.body.classList.add('cyb-privacy-modal-open');
    modal.querySelector('.cyb-privacy-modal__close')?.focus();
  }

  function readFormChoices() {
    if (!modalEl) return defaultOptional();
    return {
      functional: !!modalEl.querySelector('#cybPrivacyFunctional')?.checked,
      diagnostic: !!modalEl.querySelector('#cybPrivacyDiagnostic')?.checked,
      usage: !!modalEl.querySelector('#cybPrivacyUsage')?.checked,
    };
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement('div');
    modalEl.id = 'cybPrivacyModal';
    modalEl.className = 'cyb-privacy-modal';
    modalEl.innerHTML = `
      <div class="cyb-privacy-modal__backdrop" aria-hidden="true"></div>
      <div class="cyb-privacy-modal__card" role="dialog" aria-modal="true" aria-labelledby="cybPrivacyTitle">
        <header class="cyb-privacy-modal__header">
          <h2 id="cybPrivacyTitle" class="cyb-privacy-modal__title">${t('privacySettingsTitle', 'Настройки конфиденциальности')}</h2>
          <button type="button" class="cyb-privacy-modal__close" aria-label="${t('privacySettingsClose', 'Закрыть')}">×</button>
        </header>
        <div class="cyb-privacy-modal__body">
          <p class="cyb-privacy-modal__intro">
            ${t('privacySettingsIntroBefore', 'Мы используем cookie и похожие технологии для работы сайта и улучшения вашего опыта. Подробнее — в разделе ')}
            <a href="${privacyCookiesUrl()}">${t('privacySettingsIntroLink', '«Cookies и локальное хранилище»')}</a>${t('privacySettingsIntroAfter', ' политики конфиденциальности.')}
          </p>

          <div class="cyb-privacy-modal__quick">
            <button type="button" class="cyb-privacy-modal__btn cyb-privacy-modal__btn--primary" data-privacy-allow-all>
              ${t('privacySettingsAllowAll', 'Разрешить все cookie')}
            </button>
            <button type="button" class="cyb-privacy-modal__btn cyb-privacy-modal__btn--outline" data-privacy-reject-all>
              ${t('privacySettingsRejectAll', 'Отклонить все cookie')}
            </button>
          </div>

          <p class="cyb-privacy-modal__note">
            <strong>${t('privacySettingsNoteLabel', 'ПРИМЕЧАНИЕ.')}</strong>
            ${t('privacySettingsNote', 'CybLight не продаёт ваши данные и не использует их для таргетированной рекламы.')}
          </p>

          <h3 class="cyb-privacy-modal__section-title">${t('privacySettingsPersonal', 'Персональные настройки')}</h3>
          <hr class="cyb-privacy-modal__divider" />

          <div class="cyb-privacy-option cyb-privacy-option--locked">
            <label class="cyb-privacy-option__head">
              <input type="checkbox" checked disabled />
              <span>${t('privacySettingsNecessary', 'Строго необходимые cookie')}</span>
            </label>
            <p class="cyb-privacy-option__desc">${t('privacySettingsNecessaryDesc', 'Нужны для базовой работы сайта, безопасности Cloudflare, входа в аккаунт CybLight и сохранения этих настроек. Их нельзя отключить.')}</p>
          </div>

          <div class="cyb-privacy-option">
            <label class="cyb-privacy-option__head">
              <input type="checkbox" id="cybPrivacyFunctional" />
              <span>${t('privacySettingsFunctional', 'Разрешить функциональные cookie')}</span>
            </label>
            <p class="cyb-privacy-option__desc">${t('privacySettingsFunctionalDesc', 'Сохраняют выбранную тему, язык интерфейса, локальные рекорды в играх и другие настройки для удобства.')}</p>
          </div>

          <div class="cyb-privacy-option">
            <label class="cyb-privacy-option__head">
              <input type="checkbox" id="cybPrivacyDiagnostic" />
              <span>${t('privacySettingsDiagnostic', 'Отправлять диагностические данные')}</span>
            </label>
            <p class="cyb-privacy-option__desc">${t('privacySettingsDiagnosticDesc', 'Позволяет отправлять отчёты «Сообщить о проблеме» и технические события (например, срабатывание пасхалок) для исправления ошибок.')}</p>
          </div>

          <div class="cyb-privacy-option">
            <label class="cyb-privacy-option__head">
              <input type="checkbox" id="cybPrivacyUsage" />
              <span>${t('privacySettingsUsage', 'Отправлять данные об использовании')}</span>
            </label>
            <p class="cyb-privacy-option__desc">${t('privacySettingsUsageDesc', 'Включает счётчик пользователей онлайн, статистику YouTube-каналов, встроенные видео и сторонние виджеты (MyWOT, MyNickname).')}</p>
          </div>

          <div class="cyb-privacy-modal__footer">
            <button type="button" class="cyb-privacy-modal__btn cyb-privacy-modal__btn--primary" data-privacy-confirm>
              ${t('privacySettingsConfirm', 'Подтвердить')}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    modalEl.querySelector('.cyb-privacy-modal__backdrop')?.addEventListener('click', closeModal);
    modalEl.querySelector('.cyb-privacy-modal__close')?.addEventListener('click', closeModal);

    modalEl.querySelector('[data-privacy-allow-all]')?.addEventListener('click', () => {
      saveConsent({ functional: true, diagnostic: true, usage: true });
      closeModal();
    });

    modalEl.querySelector('[data-privacy-reject-all]')?.addEventListener('click', () => {
      saveConsent({ functional: false, diagnostic: false, usage: false });
      closeModal();
    });

    modalEl.querySelector('[data-privacy-confirm]')?.addEventListener('click', () => {
      saveConsent(readFormChoices());
      closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalEl?.classList.contains('is-open')) closeModal();
    });

    return modalEl;
  }

  function ensureBanner() {
    if (bannerEl) return bannerEl;

    bannerEl = document.createElement('div');
    bannerEl.id = 'cybPrivacyBanner';
    bannerEl.className = 'cyb-privacy-banner';
    bannerEl.setAttribute('role', 'region');
    bannerEl.setAttribute('aria-label', t('privacySettingsTitle', 'Настройки конфиденциальности'));
    bannerEl.innerHTML = `
      <div class="cyb-privacy-banner__inner">
        <h2 class="cyb-privacy-banner__title">${t('privacySettingsTitle', 'Настройки конфиденциальности')}</h2>
        <p class="cyb-privacy-banner__text">
          ${t('privacyBannerP1', 'Наш сайт использует cookie и похожие технологии для работы и улучшения вашего опыта. Некоторые необходимы для работы сайта, другие помогают сохранять ваши настройки.')}
          ${t('privacyBannerP2', ' Если нажать «Принять», будут сохранены все cookie. Если «Отклонить» — будут заблокированы все необязательные cookie.')}
          ${t('privacyBannerP3Before', ' Подробнее — в разделе ')}
          <a href="${privacyCookiesUrl()}">${t('privacySettingsIntroLink', '«Cookies и локальное хранилище»')}</a>${t('privacyBannerP3And', ' и в ')}<a href="${privacyPolicyUrl()}">${t('privacyBannerPolicyLink', '«Политике конфиденциальности»')}</a>.
        </p>
        <div class="cyb-privacy-banner__actions">
          <button type="button" class="cyb-privacy-banner__btn cyb-privacy-banner__btn--primary" data-privacy-banner-accept>
            ${t('privacyBannerAccept', 'Принять')}
          </button>
          <button type="button" class="cyb-privacy-banner__btn cyb-privacy-banner__btn--primary" data-privacy-banner-reject>
            ${t('privacyBannerReject', 'Отклонить')}
          </button>
          <button type="button" class="cyb-privacy-banner__btn cyb-privacy-banner__btn--link" data-privacy-banner-configure>
            ${t('privacyBannerConfigure', 'Настроить')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(bannerEl);

    bannerEl.querySelector('[data-privacy-banner-accept]')?.addEventListener('click', () => {
      saveConsent({ functional: true, diagnostic: true, usage: true });
    });

    bannerEl.querySelector('[data-privacy-banner-reject]')?.addEventListener('click', () => {
      saveConsent({ functional: false, diagnostic: false, usage: false });
    });

    bannerEl.querySelector('[data-privacy-banner-configure]')?.addEventListener('click', () => {
      openModal();
    });

    return bannerEl;
  }

  window.CybPrivacy = {
    getConsent,
    allows,
    open: openModal,
    apply: applyPrivacyState,
  };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.jsPrivacySettings');
    if (!link) return;
    e.preventDefault();
    openModal();
  });

  document.addEventListener('DOMContentLoaded', () => {
    applyPrivacyState();
    if (!getConsent().decided) showBanner();
  });
})();
