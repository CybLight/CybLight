// standalone report modal for the main site

function t(key) {
  const s = window.CYB_STRINGS || {};
  return s[key] != null ? s[key] : key;
}

// parse user agent to send browser/os info (copied from login repo)
function parseUA(ua = '') {
  ua = String(ua);

  const isAndroid = /Android/i.test(ua);
  const isIphone = /iPhone/i.test(ua);
  const isIpad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && /Mobile/i.test(ua));
  const isMac = /Mac OS X/i.test(ua);
  const isWindows = /Windows NT/i.test(ua);
  const isLinux = /Linux/i.test(ua) && !isAndroid;

  // browser
  let browser = 'Browser';
  let version = '';
  let m = null;

  if ((m = ua.match(/Firefox\/([\d.]+)/i))) {
    browser = 'Firefox';
    version = m[1];
  } else if ((m = ua.match(/Edg\/([\d.]+)/i))) {
    browser = 'Edge';
    version = m[1];
  } else if ((m = ua.match(/Chrome\/([\d.]+)/i))) {
    browser = 'Chrome';
    version = m[1];
  } else if ((m = ua.match(/Safari\/([\d.]+)/i))) {
    browser = 'Safari';
    version = m[1];
  }

  // os
  let os = 'OS';
  if (isWindows) os = 'Windows';
  else if (isMac) os = 'Mac';
  else if (isLinux) os = 'Linux';
  else if (isAndroid) os = 'Android';
  else if (isIphone) os = 'iPhone';
  else if (isIpad) os = 'iPad';

  return { browser, version, os };
}

// try current API domain first, then legacy backend paths
async function reportApiCall(options) {
  const endpoints = [
    'https://api.cyblight.org/error/report',
  ];

  let lastNetworkError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, options);
      if (response.status === 404) continue;
      return response;
    } catch (err) {
      lastNetworkError = err;
    }
  }

  if (lastNetworkError) throw lastNetworkError;
  throw new Error('Не найден рабочий endpoint для отправки отчёта');
}

(function () {
  function ensureModal() {
    let modal = document.getElementById('cybReportModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'cybReportModal';
    modal.className = 'cyb-report-modal';
    modal.innerHTML = `
    <div class="cyb-report-modal__backdrop"></div>
    <div class="cyb-report-modal__card" role="dialog" aria-modal="true" aria-labelledby="cybReportTitle">
      <div class="cyb-report-modal__header">
        <img src="/images/report.svg" alt="" class="cyb-report-modal__icon" aria-hidden="true" />
        <div>
          <div id="cybReportTitle" class="cyb-report-modal__title">${t('reportTitle')}</div>
          <p class="cyb-report-modal__subtitle">${t('reportSubtitle')}</p>
        </div>
      </div>
      <form id="reportForm" class="cyb-report-modal__form">
        <div class="field">
          <label class="label" for="reportEmail">${t('reportEmail')}</label>
          <input class="input" id="reportEmail" type="email" placeholder="your@email.com" />
        </div>
        <div class="field">
          <label class="label" for="reportCategory">${t('reportCategory')}</label>
          <select class="input" id="reportCategory" required>
            <option value="">${t('reportCategoryPlaceholder')}</option>
            <option value="bug">${t('reportBug')}</option>
            <option value="performance">${t('reportPerformance')}</option>
            <option value="security">${t('reportSecurity')}</option>
            <option value="feature">${t('reportFeature')}</option>
            <option value="other">${t('reportOther')}</option>
          </select>
        </div>
        <div class="field">
          <label class="label" for="reportMessage">${t('reportMessage')}</label>
          <textarea class="input" id="reportMessage" rows="5" placeholder="${t('reportMessagePlaceholder')}" required></textarea>
        </div>
        <div class="msg msg--warn" id="reportWarning" style="display: none;"></div>
        <div class="msg msg--ok" id="reportSuccess" style="display: none;"></div>
        <div class="cyb-report-modal__actions">
          <button class="btn btn-outline" type="button" id="reportCancel">${t('reportCancel')}</button>
          <button class="btn btn-primary" type="submit" id="reportSubmit">${t('reportSubmit')}</button>
        </div>
      </form>
    </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.cyb-report-modal__backdrop')?.addEventListener('click', () => {
      modal?.classList.remove('is-open');
    });
    modal.querySelector('#reportCancel')?.addEventListener('click', () => {
      modal?.classList.remove('is-open');
    });
    modal.querySelector('#reportForm')?.addEventListener('submit', handleSubmit);
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal?.classList.contains('is-open')) {
        modal.classList.remove('is-open');
      }
    });

    return modal;
  }

  function openModal() {
    const modal = ensureModal();
    const form = modal.querySelector('#reportForm');
    const warning = modal.querySelector('#reportWarning');
    const success = modal.querySelector('#reportSuccess');
    form.reset();
    warning.style.display = 'none';
    success.style.display = 'none';
    modal.classList.add('is-open');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const modal = document.getElementById('cybReportModal');
    if (!modal) return;
    const form = modal.querySelector('#reportForm');
    const emailInput = modal.querySelector('#reportEmail');
    const categorySelect = modal.querySelector('#reportCategory');
    const messageInput = modal.querySelector('#reportMessage');
    const submitBtn = modal.querySelector('#reportSubmit');
    const warning = modal.querySelector('#reportWarning');
    const success = modal.querySelector('#reportSuccess');
    const email = emailInput.value.trim();
    const category = categorySelect.value;
    const message = messageInput.value.trim();
    if (!message) {
      warning.textContent = t('reportNeedMessage');
      warning.style.display = 'block';
      return;
    }
    if (!category) {
      warning.textContent = t('reportNeedCategory');
      warning.style.display = 'block';
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = t('reportSending');
    warning.style.display = 'none';
    success.style.display = 'none';

    try {
      const ua = parseUA(navigator.userAgent);
      const response = await reportApiCall({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          type: category || 'unknown',
          email: email || null,
          category,
          message,
          userAgent: navigator.userAgent,
          browser: ua.browser,
          os: ua.os,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }),
      });
      if (response.ok) {
        success.textContent = t('reportSuccess');
        success.style.display = 'block';
        form.reset();
        setTimeout(() => modal.classList.remove('is-open'), 2000);
      } else {
        const err = await response.json().catch(() => ({}));
        warning.textContent = err.message || t('reportError');
        warning.style.display = 'block';
      }
    } catch (err) {
      console.error('Report error', err);
      warning.textContent = t('reportNetworkError');
      warning.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t('reportSubmit');
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.closest('[data-report-modal-open]')) {
      event.preventDefault();
      openModal();
    }
  });
})();
