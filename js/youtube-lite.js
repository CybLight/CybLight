(function () {
  var ALLOW =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

  function loadVideo(btn) {
    var id = btn.getAttribute('data-video-id');
    if (!id) return;

    var title = btn.getAttribute('data-title') || 'YouTube video';
    var container = btn.closest('.video-container');
    if (!container) return;

    var iframe = document.createElement('iframe');
    iframe.src =
      'https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(id) +
      '?autoplay=1&rel=0';
    iframe.title = title;
    iframe.setAttribute('allow', ALLOW);
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.allowFullscreen = true;

    container.replaceChildren(iframe);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.yt-lite');
    if (!btn) return;
    e.preventDefault();
    if (window.CybPrivacy && !window.CybPrivacy.allows('usage')) {
      if (window.CybPrivacy.open) window.CybPrivacy.open();
      return;
    }
    loadVideo(btn);
  });
})();
