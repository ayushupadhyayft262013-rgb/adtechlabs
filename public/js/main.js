// ========== HEADER SCROLL EFFECT ==========
const header = document.querySelector('.header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ========== MOBILE MENU ==========
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileOverlay = document.querySelector('.mobile-overlay');

function toggleMobileMenu() {
  const isActive = hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active', isActive);
  mobileOverlay.classList.toggle('active', isActive);
  document.body.style.overflow = isActive ? 'hidden' : '';
}

hamburger?.addEventListener('click', toggleMobileMenu);
mobileOverlay?.addEventListener('click', toggleMobileMenu);
mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger.classList.contains('active')) toggleMobileMenu();
  });
});

// ========== SCROLL REVEAL (Intersection Observer) ==========
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ========== ACTIVE NAV LINK ==========
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (currentPath === href || currentPath === href + '/' ||
      (href === '/' && (currentPath === '/' || currentPath === '/index.html' || currentPath === ''))) {
    link.classList.add('active');
  }
});
