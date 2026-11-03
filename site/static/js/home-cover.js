/* Home → About → Projects의 실제 문서 사이에서 화면 전체를 넘긴다. */
// API 참고: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
(() => {
  const script = document.currentScript;
  if (!script?.dataset.homeUrl || !script.dataset.aboutUrl || !script.dataset.projectsUrl) return;
  const homeURL = new URL(script.dataset.homeUrl, window.location.href).href;
  const aboutURL = new URL(script.dataset.aboutUrl, window.location.href).href;
  const projectsURL = new URL(script.dataset.projectsUrl, window.location.href).href;
  const routes = new Map([[homeURL, aboutURL], [aboutURL, projectsURL]]);
  const storageKey = 'taerin-home-page-turn';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let captureLayer;

  const cleanCapture = () => {
    captureLayer?.remove();
    captureLayer = null;
    document.documentElement.classList.remove('book-departure', 'book-arrival');
  };

  // 한 장의 평면 대신 좁은 띠들을 연결해 가장자리부터 휘는 종이를 만든다.
  const makeCapture = (request, front) => {
    const layer = document.createElement('div');
    layer.className = 'book-capture-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.setAttribute('inert', '');
    let page;
    if (front) {
      page = document.createElement('div');
      page.className = 'book-capture-page';
      Object.assign(page.style, {
        width: `${request.pageWidth}px`, height: `${request.pageHeight}px`,
        top: `${-window.scrollY}px`, backgroundColor: request.paperColor,
      });
      page.append(document.querySelector('main#content').cloneNode(true));
      const footer = document.querySelector('body > .footer');
      if (footer) page.append(footer.cloneNode(true));
      // 캡처용 복제에서도 클릭 직전의 색과 화살표 위치를 그대로 유지한다.
      for (const selector of ['.about-cover-front', '.cover-arrow', '.about-next-arrow']) {
        const original = document.querySelector(selector);
        const copy = page.querySelector(selector);
        if (original && copy) {
          const style = window.getComputedStyle(original);
          copy.style.backgroundColor = style.backgroundColor;
          copy.style.transform = style.transform;
        }
      }
    }
    const step = request.width / request.count;
    for (let index = 0; index < request.count; index++) {
      const strip = document.createElement('div');
      strip.className = 'book-capture-strip';
      Object.assign(strip.style, {
        left: `${index * step}px`, width: `${step + 1}px`,
        height: `${request.height}px`, viewTransitionName: `book-strip-${index}`,
      });
      if (front) {
        const copy = page.cloneNode(true);
        copy.style.left = `${-index * step}px`;
        strip.append(copy);
      } else {
        strip.style.backgroundColor = request.paperColor;
      }
      layer.append(strip);
    }
    return layer;
  };

  const animatePaper = (request) => {
    const count = request.count;
    const step = request.width / count;
    const perspective = Math.max(1800, request.width * 2);
    const positions = Array.from({ length: count }, () => []);
    const fronts = Array.from({ length: count }, () => []);
    const backs = Array.from({ length: count }, () => []);
    for (let frame = 0; frame <= 60; frame++) {
      const progress = frame / 60;
      let x = 0;
      let z = 0;
      for (let index = 0; index < count; index++) {
        const delay = 0.42 * (1 - (index + 0.5) / count);
        const local = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
        const angle = -Math.PI * local * local * (3 - 2 * local);
        const cosine = Math.cos(angle);
        const light = 0.94 + 0.06 * Math.abs(cosine);
        positions[index].push({
          offset: progress,
          transform: `perspective(${perspective}px) translate3d(${x}px, 0, ${z}px) rotateY(${angle}rad)`,
        });
        fronts[index].push({ offset: progress, opacity: cosine >= 0 ? 1 : 0, filter: `brightness(${light})` });
        backs[index].push({ offset: progress, opacity: cosine < 0 ? 1 : 0, filter: `brightness(${light})` });
        x += step * cosine;
        z -= step * Math.sin(angle);
      }
    }
    const duration = request.width <= 900 ? 950 : 1150;
    for (let index = 0; index < count; index++) {
      const name = `book-strip-${index}`;
      for (const [part, frames] of [['group', positions[index]], ['old', fronts[index]], ['new', backs[index]]]) {
        document.documentElement.animate(frames, {
          duration, easing: 'linear', fill: 'both',
          pseudoElement: `::view-transition-${part}(${name})`,
        });
      }
    }
  };

  const clearRequest = () => {
    try { window.sessionStorage.removeItem(storageKey); } catch { /* 기본 링크 이동 유지 */ }
  };

  const readRequest = () => {
    try {
      const request = JSON.parse(window.sessionStorage.getItem(storageKey));
      return request && routes.has(request.from) && routes.get(request.from) === request.to &&
        Date.now() - request.time < 8000 ? request : null;
    } catch { return null; }
  };

  // 이 이벤트는 첫 화면이 그려지기 전에 등록해야 하므로 head에서 읽는다.
  window.addEventListener('pageswap', (event) => {
    if (!event.viewTransition) return;
    const destination = event.activation?.entry?.url;
    const pending = readRequest();
    if (reducedMotion.matches || !pending || window.location.href !== pending.from ||
        (destination && destination !== pending.to)) {
      event.viewTransition.skipTransition();
      return;
    }
    try {
      const request = {
        ...pending, width: window.innerWidth, height: window.innerHeight,
        pageWidth: document.documentElement.clientWidth,
        pageHeight: Math.max(document.documentElement.scrollHeight, window.innerHeight),
        count: window.innerWidth <= 900 ? 14 : 24,
        paperColor: window.getComputedStyle(document.documentElement).backgroundColor,
      };
      window.sessionStorage.setItem(storageKey, JSON.stringify(request));
      captureLayer = makeCapture(request, true);
      document.documentElement.classList.add('book-departure');
      document.body.append(captureLayer);
      event.viewTransition.finished.finally(cleanCapture).catch(() => {});
    } catch (error) {
      console.debug('페이지 넘김 캡처를 생략하고 기본 이동을 사용합니다.', error);
      clearRequest();
      cleanCapture();
      event.viewTransition.skipTransition();
    }
  });

  window.addEventListener('pagereveal', (event) => {
    const request = readRequest();
    clearRequest();
    if (!event.viewTransition) return;
    if (!request || ![14, 24].includes(request.count) ||
        Math.abs(window.innerWidth - request.width) > 1 ||
        window.location.href !== request.to || reducedMotion.matches) {
      event.viewTransition.skipTransition();
      return;
    }
    try {
      captureLayer = makeCapture(request, false);
      document.documentElement.classList.add('book-arrival');
      document.body.append(captureLayer);
      event.viewTransition.ready.then(() => animatePaper(request)).catch((error) => {
        console.debug('종이 넘김을 생략하고 기본 이동을 사용합니다.', error);
        event.viewTransition.skipTransition();
        cleanCapture();
      });
      event.viewTransition.finished.finally(cleanCapture).catch(() => {});
    } catch {
      event.viewTransition.skipTransition();
      cleanCapture();
    }
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted || window.location.href === homeURL) {
      cleanCapture();
      clearRequest();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const cover = document.querySelector('.about-cover, [data-page-turn]');
    if (!cover || routes.get(window.location.href) !== cover.href) return;
    let prefetched = false;
    const prefetchNext = () => {
      if (prefetched) return;
      prefetched = true;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = cover.href;
      document.head.append(link);
    };
    cover.addEventListener('pointerenter', prefetchNext, { once: true });
    cover.addEventListener('focus', prefetchNext, { once: true });
    cover.addEventListener('touchstart', prefetchNext, { once: true, passive: true });
    cover.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
      prefetchNext();
      try {
        window.sessionStorage.setItem(storageKey, JSON.stringify({
          from: window.location.href, to: cover.href, time: Date.now(),
        }));
      } catch { /* 저장소를 사용할 수 없어도 실제 링크로 이동한다. */ }
      // 이동을 가로채지 않아 미지원 브라우저와 키보드에서도 링크가 동작한다.
    });
  });
})();
