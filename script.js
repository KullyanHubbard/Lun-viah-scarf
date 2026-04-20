const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const heroImage = document.querySelector('.hero-image');
const searchForm = document.querySelector('.nav-search');
const searchToggle = document.querySelector('.search-toggle');
const searchInput = document.querySelector('.nav-search-input');
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

function closeSearch() {
    if (!searchForm || !searchToggle) return;

    searchForm.classList.remove('active');
    searchToggle.classList.remove('active');
    searchToggle.setAttribute('aria-expanded', 'false');
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            event.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks?.classList.remove('active');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            closeSearch();
        });
    });
}

function initMobileMenu() {
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        closeSearch();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(navLinks.classList.contains('active')));
    });
}

function initSearchToggle() {
    if (!searchForm || !searchToggle || !searchInput) return;

    searchToggle.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const shouldOpen = !searchForm.classList.contains('active');
        closeSearch();

        if (shouldOpen) {
            navLinks?.classList.remove('active');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            searchForm.classList.add('active');
            searchToggle.classList.add('active');
            searchToggle.setAttribute('aria-expanded', 'true');
            requestAnimationFrame(() => searchInput.focus());
        }
    });

    searchForm.addEventListener('click', event => {
        event.stopPropagation();
    });

    document.addEventListener('click', event => {
        if (!searchForm.contains(event.target)) {
            closeSearch();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeSearch();
            searchToggle.focus();
        }
    });
}

function filterCollection() {
    if (!productCards.length) return;

    const query = searchInput?.value.trim().toLowerCase() ?? '';
    let visibleCount = 0;

    productCards.forEach(card => {
        const isMatch = !query || card.textContent.toLowerCase().includes(query);
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
    if (!searchInput || !productCards.length) return;

    searchInput.addEventListener('input', filterCollection);

    searchForm?.addEventListener('submit', event => {
        event.preventDefault();
        filterCollection();
        koleksiSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setMotionReveal();
    revealOnScroll();
    initSmoothScroll();
    initMobileMenu();
    initSearchToggle();
    initCollectionSearch();
    handleNavbarScroll();
    handleHeroParallax();
});

window.addEventListener('scroll', () => {
    handleNavbarScroll();
    handleHeroParallax();
});
