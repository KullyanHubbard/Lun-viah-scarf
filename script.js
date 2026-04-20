const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const heroImage = document.querySelector('.hero-image');
const searchForm = document.querySelector('.nav-search');
const searchToggle = document.querySelector('.search-toggle');
const searchInputDesktop = document.querySelector('.nav-search-input');
const searchToggleMobile = document.querySelector('.nav-mobile-search-toggle');
const searchMobilePanel = document.querySelector('.nav-mobile-search-panel');
const searchInputMobile = document.querySelector('.nav-search-input-mobile');
const koleksiSection = document.querySelector('#koleksi');
const productCards = document.querySelectorAll('.koleksi .card');
const searchEmpty = document.querySelector('.search-empty');

const revealElements = document.querySelectorAll(
    '.hero-content, .hero-image, .about-text, .about-image, .card, .keunggulan .item, .testi-card, .gallery-grid img, .footer-content'
);

function setMotionReveal() {
    revealElements.forEach(el => el.classList.add('motion-reveal'));
}

function revealOnScroll() {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        }
    );

    revealElements.forEach(el => observer.observe(el));
}

function handleNavbarScroll() {
    if (!navbar) return;

    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function handleHeroParallax() {
    if (!heroImage) return;
    const offset = Math.min(window.scrollY * 0.06, 40);
    heroImage.style.transform = `translateY(${offset}px)`;
}

function closeDesktopSearch() {
    if (!searchForm || !searchToggle) return;

    searchForm.classList.remove('active');
    searchToggle.classList.remove('active');
    searchToggle.setAttribute('aria-expanded', 'false');
}

function closeMobileSearch() {
    if (!searchMobilePanel || !searchToggleMobile) return;

    searchMobilePanel.classList.remove('active');
    searchToggleMobile.classList.remove('active');
    searchToggleMobile.setAttribute('aria-expanded', 'false');
}

function closeAllSearch() {
    closeDesktopSearch();
    closeMobileSearch();
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            let targetElement = null;

            if (targetId && targetId !== '#') {
                targetElement = document.querySelector(targetId);
            }

            event.preventDefault();

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            navLinks?.classList.remove('active');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            closeAllSearch();
        });
    });
}

function initMobileMenu() {
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        closeAllSearch();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(navLinks.classList.contains('active')));
    });
}

function initDesktopSearchToggle() {
    if (!searchForm || !searchToggle || !searchInputDesktop) return;

    searchToggle.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const shouldOpen = !searchForm.classList.contains('active');
        closeDesktopSearch();

        if (shouldOpen) {
            closeMobileSearch();
            navLinks?.classList.remove('active');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            searchForm.classList.add('active');
            searchToggle.classList.add('active');
            searchToggle.setAttribute('aria-expanded', 'true');
            requestAnimationFrame(() => searchInputDesktop.focus());
        }
    });

    searchForm.addEventListener('click', event => {
        event.stopPropagation();
    });
}

function initMobileSearchToggle() {
    if (!searchMobilePanel || !searchToggleMobile || !searchInputMobile) return;

    searchToggleMobile.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const shouldOpen = !searchMobilePanel.classList.contains('active');
        closeMobileSearch();

        if (shouldOpen) {
            closeDesktopSearch();
            searchMobilePanel.classList.add('active');
            searchToggleMobile.classList.add('active');
            searchToggleMobile.setAttribute('aria-expanded', 'true');
            requestAnimationFrame(() => searchInputMobile.focus());
        }
    });

    searchMobilePanel.addEventListener('click', event => {
        event.stopPropagation();
    });
}

function initSearchDismissHandlers() {
    document.addEventListener('click', event => {
        if (searchForm && !searchForm.contains(event.target)) {
            closeDesktopSearch();
        }

        if (
            searchMobilePanel &&
            !searchMobilePanel.contains(event.target) &&
            !searchToggleMobile?.contains(event.target)
        ) {
            closeMobileSearch();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;

        const desktopWasActive = Boolean(searchForm?.classList.contains('active'));
        const mobileWasActive = Boolean(searchMobilePanel?.classList.contains('active'));

        closeAllSearch();

        if (desktopWasActive) {
            searchToggle.focus();
        } else if (mobileWasActive) {
            searchToggleMobile?.focus();
        }
    });
}

function syncSearchInputs(value, source) {
    if (source !== searchInputDesktop && searchInputDesktop) {
        searchInputDesktop.value = value;
    }

    if (source !== searchInputMobile && searchInputMobile) {
        searchInputMobile.value = value;
    }
}

function filterCollection(query) {
    if (!productCards.length) return;

    const normalizedQuery = query?.trim().toLowerCase() ?? '';
    let visibleCount = 0;

    productCards.forEach(card => {
        const isMatch = !normalizedQuery || card.textContent.toLowerCase().includes(normalizedQuery);
        card.hidden = !isMatch;

        if (isMatch) {
            visibleCount += 1;
        }
    });

    if (searchEmpty) {
        searchEmpty.hidden = visibleCount !== 0;
    }
}

function initCollectionSearch() {
    if (!productCards.length) return;

    const searchInputs = [searchInputDesktop, searchInputMobile].filter(Boolean);

    searchInputs.forEach(input => {
        input.addEventListener('input', event => {
            const value = event.target.value;
            syncSearchInputs(value, input);
            filterCollection(value);
        });
    });

    const searchForms = [searchForm, searchMobilePanel].filter(Boolean);

    searchForms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const submittedInput = form.querySelector('input[type="search"]');
            const value = submittedInput?.value ?? '';
            syncSearchInputs(value, submittedInput);
            filterCollection(value);
            navLinks?.classList.remove('active');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            closeAllSearch();
            koleksiSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setMotionReveal();
    revealOnScroll();
    initSmoothScroll();
    initMobileMenu();
    initDesktopSearchToggle();
    initMobileSearchToggle();
    initSearchDismissHandlers();
    initCollectionSearch();
    handleNavbarScroll();
    handleHeroParallax();
});

window.addEventListener('scroll', () => {
    handleNavbarScroll();
    handleHeroParallax();
});
