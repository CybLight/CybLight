/**
 * CybLight Platform Status Checker & Modal
 * Performs lightweight health checks and latency measurements for key infrastructure components.
 */
(function () {
  const SERVICES = [
    {
      id: 'api',
      name: 'CybLight Cloud API',
      url: 'https://api.cyblight.org/stats/online',
      description: 'REST API, телеметрия и сбор данных IoT'
    },
    {
      id: 'auth',
      name: 'Авторизация и E2EE (login.cyblight.org)',
      url: 'https://login.cyblight.org/ru/username',
      description: 'Безопасный вход, ключи Passkeys и Turnstile'
    },
    {
      id: 'backend',
      name: 'Smart Home Hub Sync Gateway',
      url: 'https://cyblight-backend.onrender.com/api/youtube/stats?channel=main',
      description: 'Сервер сквозной синхронизации устройств'
    },
    {
      id: 'cdn',
      name: 'Edge CDN & Web Infrastructure',
      url: window.location.origin + '/images/favicon_32.png',
      description: 'Глобальная сеть доставки контента и статики'
    }
  ];

  let modalEl = null;

  function createStatusModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement('div');
    modalEl.id = 'cybStatusModal';
    modalEl.className = 'cyb-status-modal';
    modalEl.innerHTML = `
      <div class="cyb-status-modal__backdrop" aria-hidden="true"></div>
      <div class="cyb-status-modal__card" role="dialog" aria-modal="true" aria-labelledby="statusModalTitle">
        <div class="cyb-status-modal__header">
          <div>
            <div class="cyb-status-modal__badge">
              <span class="cyb-status-dot cyb-status-dot--pulse"></span>
              <span id="globalStatusText">Проверка систем...</span>
            </div>
            <h2 id="statusModalTitle" class="cyb-status-modal__title">Статус платформы CybLight</h2>
            <p class="cyb-status-modal__subtitle">Мониторинг работоспособности облачных сервисов в реальном времени</p>
          </div>
          <button type="button" class="cyb-status-modal__close" aria-label="Закрыть">✕</button>
        </div>

        <div class="cyb-status-services" id="statusServicesList">
          <!-- Injected dynamically -->
        </div>

        <div class="cyb-status-modal__footer">
          <div class="cyb-status-updated" id="statusLastUpdated">Обновлено: только что</div>
          <div class="cyb-status-actions">
            <button type="button" class="button button--secondary" id="btnRefreshStatus">🔄 Проверить снова</button>
            <button type="button" class="button" data-status-close>Закрыть</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    modalEl.querySelector('.cyb-status-modal__backdrop')?.addEventListener('click', closeStatusModal);
    modalEl.querySelector('.cyb-status-modal__close')?.addEventListener('click', closeStatusModal);
    modalEl.querySelector('[data-status-close]')?.addEventListener('click', closeStatusModal);
    modalEl.querySelector('#btnRefreshStatus')?.addEventListener('click', checkAllServices);

    document.addEventListener('keydown', (e) => {
      if (modalEl.classList.contains('is-open') && e.key === 'Escape') {
        closeStatusModal();
      }
    });

    return modalEl;
  }

  function openStatusModal() {
    const modal = createStatusModal();
    modal.classList.add('is-open');
    document.body.classList.add('cyb-modal-open');
    checkAllServices();
  }

  function closeStatusModal() {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    document.body.classList.remove('cyb-modal-open');
  }

  async function pingService(service) {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      
      const res = await fetch(service.url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const latency = Math.round(performance.now() - start);

      return {
        ...service,
        status: 'online',
        latency: latency,
        statusLabel: 'Работает в штатном режиме'
      };
    } catch (e) {
      return {
        ...service,
        status: 'warning',
        latency: null,
        statusLabel: 'Ограниченный доступ или задержка'
      };
    }
  }

  async function checkAllServices() {
    const listEl = document.getElementById('statusServicesList');
    const globalText = document.getElementById('globalStatusText');
    const updatedEl = document.getElementById('statusLastUpdated');
    if (!listEl) return;

    listEl.innerHTML = SERVICES.map(s => `
      <div class="cyb-status-row cyb-status-row--loading" id="status-row-${s.id}">
        <div class="cyb-status-row__main">
          <div class="cyb-status-row__name">${s.name}</div>
          <div class="cyb-status-row__desc">${s.description}</div>
        </div>
        <div class="cyb-status-row__state">
          <span class="cyb-status-spinner"></span>
          <span class="cyb-status-row__ping">Измерение...</span>
        </div>
      </div>
    `).join('');

    if (globalText) globalText.textContent = 'Опрос узлов платформы...';

    const results = await Promise.all(SERVICES.map(s => pingService(s)));

    let allOk = true;
    listEl.innerHTML = results.map(r => {
      if (r.status !== 'online') allOk = false;
      const isOnline = r.status === 'online';
      const pingText = r.latency != null ? `${r.latency} ms` : '—';
      
      return `
        <div class="cyb-status-row cyb-status-row--${r.status}">
          <div class="cyb-status-row__main">
            <div class="cyb-status-row__name">
              <span class="cyb-status-dot ${isOnline ? 'cyb-status-dot--green' : 'cyb-status-dot--yellow'}"></span>
              ${r.name}
            </div>
            <div class="cyb-status-row__desc">${r.description}</div>
          </div>
          <div class="cyb-status-row__state">
            <span class="cyb-status-row__badge ${isOnline ? 'is-operational' : 'is-degraded'}">${r.statusLabel}</span>
            <span class="cyb-status-row__ping">${pingText}</span>
          </div>
        </div>
      `;
    }).join('');

    if (globalText) {
      globalText.textContent = allOk ? 'Все системы работают в штатном режиме' : 'Некоторые узлы испытывают задержки';
    }

    if (updatedEl) {
      const now = new Date();
      updatedEl.textContent = `Обновлено: ${now.toLocaleTimeString()}`;
    }
  }

  // Bind clicks on header online counters or status triggers
  document.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('headerOnline');
    if (onlineEl) {
      onlineEl.style.cursor = 'pointer';
      onlineEl.title = 'Нажмите, чтобы открыть статус платформы';
      onlineEl.addEventListener('click', openStatusModal);
    }

    document.querySelectorAll('[data-status-modal-open]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openStatusModal();
      });
    });
  });

  window.CybStatus = {
    open: openStatusModal,
    check: checkAllServices
  };
})();
