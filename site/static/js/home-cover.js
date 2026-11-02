/* 홈과 About의 실제 문서 사이에서 화면 전체를 넘긴다. */
// API 참고: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
(() => {
  const script = document.currentScript;
  if (!script?.dataset.homeUrl || !script.dataset.aboutUrl) return;
  const homeURL = new URL(script.dataset.homeUrl, window.location.href).href;
  const aboutURL = new URL(script.dataset.aboutUrl, window.location.href).href;
  const storageKey = 'taerin-home-page-turn';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const clearRequest = () => {
    try { window.sessionStorage.removeItem(storageKey); } catch { /* 기본 링크 이동 유지 */ }
  };

  const readRequest = () => {
    try {
      const request = JSON.parse(window.sessionStorage.getItem(storageKey));
      return request?.from === homeURL && request.to === aboutURL &&
        Date.now() - request.time < 8000 ? request : null;
    } catch { return null; }
  };

  // 이 이벤트는 첫 화면이 그려지기 전에 등록해야 하므로 head에서 읽는다.
  window.addEventListener('pageswap', (event) => {
    if (!event.viewTransition) return;
    const destination = event.activation?.entry?.url;
    if (reducedMotion.matches || window.location.href !== homeURL ||
        !readRequest() || (destination && destination !== aboutURL)) {
      event.viewTransition.skipTransition();
    }
  });

  window.addEventListener('pagereveal', (event) => {
    const request = readRequest();
    clearRequest();
    if (!event.viewTransition) return;
    if (!request || window.location.href !== aboutURL || reducedMotion.matches) {
      event.viewTransition.skipTransition();
      return;
    }
    document.documentElement.classList.add('book-arrival');
    event.viewTransition.finished.finally(() => {
      document.documentElement.classList.remove('book-arrival');
    }).catch(() => {});
  });

  window.addEventListener('pageshow', () => {
    if (window.location.href === homeURL) {
      document.documentElement.classList.remove('book-arrival');
      clearRequest();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const cover = document.querySelector('.about-cover');
    if (!cover) return;
    let prefetched = false;
    const prefetchAbout = () => {
      if (prefetched) return;
      prefetched = true;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = cover.href;
      document.head.append(link);
    };
    cover.addEventListener('pointerenter', prefetchAbout, { once: true });
    cover.addEventListener('focus', prefetchAbout, { once: true });
    cover.addEventListener('touchstart', prefetchAbout, { once: true, passive: true });
    cover.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
      prefetchAbout();
      try {
        window.sessionStorage.setItem(storageKey, JSON.stringify({
          from: homeURL, to: aboutURL, time: Date.now(),
        }));
      } catch { /* 저장소를 사용할 수 없어도 실제 링크로 이동한다. */ }
      // 이동을 가로채지 않아 미지원 브라우저와 키보드에서도 링크가 동작한다.
    });
  });
})();
