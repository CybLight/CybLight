/**
 * CybLight Live Pricing Loader (Paddle.js v2)
 * Fetches real-time localized prices, currencies, and tax directly from Paddle.
 */
(function initPaddlePricing() {
  const PADDLE_TOKEN = 'live_5ebd6985c473eb16c78ff174fbd';
  const PADDLE_ENV = 'production';

  function applyPrices() {
    if (typeof Paddle === 'undefined') return;

    try {
      if (typeof Paddle.Environment !== 'undefined' && typeof Paddle.Environment.set === 'function') {
        Paddle.Environment.set(PADDLE_ENV);
      }
      Paddle.Initialize({ token: PADDLE_TOKEN });

      const priceElements = document.querySelectorAll('.price-amount[data-price-id-month]');
      if (!priceElements.length) return;

      const items = [];
      priceElements.forEach(function (el) {
        if (el.dataset.priceIdMonth) {
          items.push({ priceId: el.dataset.priceIdMonth, quantity: 1 });
        }
        if (el.dataset.priceIdYear) {
          items.push({ priceId: el.dataset.priceIdYear, quantity: 1 });
        }
      });

      if (!items.length) return;

      Paddle.PricePreview({ items: items })
        .then(function (result) {
          if (!result || !result.data || !result.data.details || !result.data.details.lineItems) return;

          const priceMap = {};
          result.data.details.lineItems.forEach(function (item) {
            if (item.price && item.price.id && item.formattedTotals && item.formattedTotals.total) {
              priceMap[item.price.id] = item.formattedTotals.total;
            }
          });

          priceElements.forEach(function (el) {
            if (priceMap[el.dataset.priceIdMonth]) {
              el.dataset.priceMonth = priceMap[el.dataset.priceIdMonth];
            }
            if (priceMap[el.dataset.priceIdYear]) {
              el.dataset.priceYear = priceMap[el.dataset.priceIdYear];
            }

            const btnYearly = document.getElementById('btnYearly');
            const isYearly = btnYearly && btnYearly.classList.contains('active');
            el.textContent = isYearly ? el.dataset.priceYear : el.dataset.priceMonth;
          });
        })
        .catch(function (err) {
          console.warn('[Paddle Pricing] Failed to load live price preview, falling back to static:', err);
        });
    } catch (e) {
      console.warn('[Paddle Pricing] Init error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPrices);
  } else {
    applyPrices();
  }
})();
