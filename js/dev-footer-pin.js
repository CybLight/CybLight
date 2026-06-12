/**
 * При открытой консоли (F12) закрепляет футер над панелью разработчика.
 */
(function initDevFooterPin() {
  const DEVTOOLS_MQ = '(max-height: 700px) and (min-width: 1024px)';
  const mq = window.matchMedia(DEVTOOLS_MQ);
  let resizeObserver = null;
  let observedFooter = null;

  function getFooter() {
    return document.querySelector('footer');
  }

  function unobserveFooter() {
    if (resizeObserver && observedFooter) {
      resizeObserver.unobserve(observedFooter);
      observedFooter = null;
    }
  }

  function observeFooter(footer) {
    if (!footer || typeof ResizeObserver === 'undefined') return;
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(sync);
    }
    if (observedFooter !== footer) {
      unobserveFooter();
      resizeObserver.observe(footer);
      observedFooter = footer;
    }
  }

  function isDevToolsViewport() {
    if (window.innerWidth < 1024) return false;
    if (mq.matches) return true;

    const vv = window.visualViewport;
    if (!vv) return false;

    // Док-панель DevTools уменьшает visualViewport примерно на высоту консоли
    return window.innerHeight - vv.height > 100;
  }

  function sync() {
    const root = document.documentElement;
    const body = document.body;
    const footer = getFooter();
    const pinned = isDevToolsViewport() && !!footer;

    if (!pinned) {
      root.classList.remove('dev-footer-pinned');
      body.classList.remove('dev-footer-pinned');
      root.style.removeProperty('--dev-footer-height');
      unobserveFooter();
      return;
    }

    root.classList.add('dev-footer-pinned');
    body.classList.add('dev-footer-pinned');
    root.style.setProperty('--dev-footer-height', `${footer.offsetHeight}px`);
    observeFooter(footer);
  }

  mq.addEventListener('change', sync);
  window.addEventListener('resize', sync);
  window.visualViewport?.addEventListener('resize', sync);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync);
  } else {
    sync();
  }
})();
