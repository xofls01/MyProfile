/* 실제 링크를 유지하고, 일반 클릭에만 책 표지 전환을 더한다. */
(() => {
  const cover = document.querySelector('.about-cover');
  if (!cover) return;

  const stage = cover.closest('.home-cover-stage');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let turning = false;
  let fallback;
  let prefetched = false;

  // 이동 의도가 있을 때 About 문서를 미리 받아 넘김 뒤 로딩을 줄인다.
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

  const reset = () => {
    window.clearTimeout(fallback);
    turning = false;
    stage.classList.remove('is-turning');
    stage.removeAttribute('aria-busy');
  };

  const navigate = () => {
    if (!turning) return;
    window.clearTimeout(fallback);
    turning = false;
    window.location.assign(cover.href);
  };

  cover.addEventListener('click', (event) => {
    // 새 탭 열기와 모션 줄이기 설정의 기본 이동을 보존한다.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches ||
        !window.CSS?.supports('transform-style', 'preserve-3d')) return;

    event.preventDefault();
    if (turning) return;

    prefetchAbout();
    turning = true;
    stage.setAttribute('aria-busy', 'true');
    stage.classList.add('is-turning');
    // 애니메이션 이벤트가 생략되어도 링크 이동은 완료한다.
    fallback = window.setTimeout(navigate, 1300);
  });

  cover.addEventListener('animationend', (event) => {
    if (event.target === cover && event.animationName === 'open-book-cover') navigate();
  });

  // 뒤로 가기로 복원된 홈이 표지가 열린 채 멈추지 않게 한다.
  window.addEventListener('pageshow', reset);
})();
