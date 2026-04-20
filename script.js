const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const heroImage = document.querySelector('.hero-image');

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

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            event.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

function initMobileMenu() {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setMotionReveal();
    revealOnScroll();
    initSmoothScroll();
    initMobileMenu();
    handleNavbarScroll();
    handleHeroParallax();
});

window.addEventListener('scroll', () => {
Isro Faiz Gumilang    handleNavbarScroll();
    handleHeroParallax();
});
