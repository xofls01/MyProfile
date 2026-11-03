// Gokarna의 기본 동작을 유지하며 메뉴와 테마 조작을 실제 버튼으로 연결한다.
document.addEventListener('DOMContentLoaded', ready, false);

const THEME_PREF_STORAGE_KEY = 'theme-preference';
const THEME_TO_ICON_CLASS = { dark: 'moon', light: 'sun' };
let darkThemeCss;

const HEADING_TO_TOC_CLASS = {
    H1: 'level-1', H2: 'level-2', H3: 'level-3', H4: 'level-4',
};

function ready() {
    feather.replace({ 'stroke-width': 1, width: 20, height: 20 });
    setThemeByUserPref();

    const post = document.querySelector('main#content > .container.post');
    if (post) {
        if (document.getElementById('TableOfContents')) {
            fixTocItemsIndent();
            createScrollSpy();
        } else {
            post.style.display = 'block';
        }
    }

    SVGInjector(document.querySelectorAll('img.svg-inject'));
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.nav-link a svg.svg-inject').forEach(path => {
            const bbox = path.getBBox();
            if (!bbox.width || !bbox.height) return;
            const scale = Math.min(20 / bbox.width, 20 / bbox.height);
            path.setAttribute('transform', `scale(${scale}) translate(${-bbox.x}, ${-bbox.y})`);
            path.setAttribute('stroke', 'currentColor');
            path.setAttribute('stroke-width', '1');
            path.setAttribute('fill', 'transparent');
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const header = document.querySelector('.header');
    const menu = document.getElementById('mobile-menu');
    const toggle = document.getElementById('hamburger-menu-toggle-target');
    const mobile = window.matchMedia('(max-width: 820px)');
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    const setMenuOpen = (open) => {
        menu.classList.toggle('visibility-hidden', !open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    };

    toggle.addEventListener('click', () => setMenuOpen(!isOpen()));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && isOpen()) {
            setMenuOpen(false);
            toggle.focus();
        }
    });
    document.addEventListener('click', event => {
        if (isOpen() && !header.contains(event.target)) setMenuOpen(false);
    });
    menu.addEventListener('click', event => {
        if (event.target.closest('a')) setMenuOpen(false);
    });
    header.addEventListener('focusout', event => {
        if (isOpen() && !header.contains(event.relatedTarget)) setMenuOpen(false);
    });
    mobile.addEventListener('change', () => {
        const focused = document.activeElement;
        const mobileFocused = focused === toggle || menu.contains(focused);
        const desktopFocused = focused.closest('.nav-link') && !mobileFocused;
        setMenuOpen(false);
        if (!mobile.matches && mobileFocused) {
            header.querySelector('.nav-link > a')?.focus();
        } else if (mobile.matches && desktopFocused) {
            toggle.focus();
        }
    });
}

window.addEventListener('scroll', () => {
    toggleHeaderShadow(window.innerWidth <= 820 ? 50 : 100);
}, { passive: true });

function fixTocItemsIndent() {
    document.querySelectorAll('#TableOfContents a').forEach(item => {
        const heading = document.getElementById(decodeURIComponent(item.hash.slice(1)));
        if (heading) item.classList.add(HEADING_TO_TOC_CLASS[heading.tagName]);
    });
}

function createScrollSpy() {
    const elements = document.querySelectorAll('#toc a');
    document.addEventListener('scroll', () => {
        elements.forEach(element => {
            const heading = document.getElementById(decodeURIComponent(element.hash.slice(1)));
            if (!heading) return;
            const bounds = heading.getBoundingClientRect();
            if (bounds.top <= 55 && bounds.bottom >= 0) {
                elements.forEach(item => item.classList.remove('active'));
                element.classList.add('active');
            }
        });
    }, { passive: true });
}

function toggleHeaderShadow(threshold) {
    document.querySelectorAll('.header').forEach(header => {
        header.classList.toggle('header-shadow', window.scrollY > threshold);
    });
}

function setThemeByUserPref() {
    darkThemeCss = document.getElementById('dark-theme');
    let savedTheme;
    try { savedTheme = localStorage.getItem(THEME_PREF_STORAGE_KEY); } catch { /* 저장소 없이도 기본 테마를 표시한다. */ }
    if (!['dark', 'light'].includes(savedTheme)) {
        savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setTheme(savedTheme);
    document.querySelectorAll('.dark-theme-toggle button').forEach(button => {
        button.addEventListener('click', toggleTheme);
    });
}

function toggleTheme() {
    const theme = darkThemeCss.disabled ? 'dark' : 'light';
    setTheme(theme);
    try { localStorage.setItem(THEME_PREF_STORAGE_KEY, theme); } catch { /* 현재 화면의 테마 전환은 유지한다. */ }
}

function matchThemeColor() {
    document.getElementById('theme-color')?.setAttribute(
        'content', window.getComputedStyle(document.documentElement).backgroundColor,
    );
}

function setTheme(theme) {
    const awaitingDarkCss = theme === 'dark' && darkThemeCss.disabled;
    if (awaitingDarkCss) darkThemeCss.addEventListener('load', matchThemeColor, { once: true });
    darkThemeCss.disabled = theme === 'light';
    if (!awaitingDarkCss) matchThemeColor();
    document.querySelectorAll('.dark-theme-toggle button').forEach(button => {
        button.innerHTML = feather.icons[THEME_TO_ICON_CLASS[theme]].toSvg({
            width: 22, height: 22, 'aria-hidden': 'true', focusable: 'false',
        });
        button.setAttribute('aria-pressed', String(theme === 'dark'));
    });
}
