/**
 * ADTECHLABS — Premium Animation Engine
 * Scroll reveals, parallax, magnetic cursor, smooth counters,
 * tilt effects, page transitions, and smart header hiding.
 * Works beautifully on both mobile and desktop.
 */

(function () {
  'use strict';

  // ─── UTILITIES ─────────────────────────────────────────
  const isMobile = () => window.innerWidth <= 768;
  const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raf = window.requestAnimationFrame || (cb => setTimeout(cb, 16));
  const lerp = (a, b, t) => a + (b - a) * t;

  // ─── 1. SCROLL-TRIGGERED REVEAL (Intersection Observer) ─
  function initScrollReveal() {
    const selectors = [
      '.anim-fade-up', '.anim-fade-down',
      '.anim-fade-left', '.anim-fade-right',
      '.anim-scale-in', '.anim-blur-in',
      '.anim-rotate-in', '.anim-flip-up',
      '.anim-slide-up', '.anim-clip-reveal',
      '.anim-stagger-children'
    ];

    const elements = document.querySelectorAll(selectors.join(','));
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay to feel more natural
          requestAnimationFrame(() => {
            entry.target.classList.add('is-visible');
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // ─── 2. SMOOTH SCROLL PROGRESS BAR ─────────────────────
  function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      document.body.prepend(bar);
    }

    let ticking = false;
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${Math.min(progress, 1)})`;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        raf(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── 3. SMART HEADER HIDE/SHOW ON SCROLL ───────────────
  function initSmartHeader() {
    const header = document.querySelector('header, .header');
    if (!header) return;

    let lastScrollY = 0;
    let headerHidden = false;
    const threshold = 100; // Minimum scroll before hiding
    let ticking = false;

    function update() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      if (currentY > threshold && delta > 5 && !headerHidden) {
        header.classList.add('header-hidden');
        headerHidden = true;
      } else if ((delta < -5 || currentY <= threshold) && headerHidden) {
        header.classList.remove('header-hidden');
        headerHidden = false;
      }

      // Add/remove scrolled class for shadow
      header.classList.toggle('scrolled', currentY > 20);

      lastScrollY = currentY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        raf(update);
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── 4. PARALLAX ELEMENTS ──────────────────────────────
  function initParallax() {
    if (isMobile() || isReducedMotion()) return;

    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const winH = window.innerHeight;

      elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const inView = rect.top < winH && rect.bottom > 0;

        if (inView) {
          const center = rect.top + rect.height / 2;
          const offset = (center - winH / 2) * speed;
          el.style.transform = `translateY(${offset}px)`;
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        raf(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── 5. MAGNETIC HOVER EFFECT ──────────────────────────
  function initMagneticHover() {
    if (isMobile() || isReducedMotion()) return;

    const magnetics = document.querySelectorAll('.anim-magnetic');
    magnetics.forEach(el => {
      const strength = parseFloat(el.dataset.magneticStrength) || 0.3;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ─── 6. 3D TILT ON HOVER ──────────────────────────────
  function initTiltEffect() {
    if (isMobile() || isReducedMotion()) return;

    const tiltElements = document.querySelectorAll('.anim-hover-tilt');
    tiltElements.forEach(el => {
      const maxTilt = parseFloat(el.dataset.tilt) || 6;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = x * maxTilt;
        const rotateX = -y * maxTilt;
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  // ─── 7. RIPPLE EFFECT ON BUTTONS ───────────────────────
  function initRipple() {
    document.querySelectorAll('.anim-ripple').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--ripple-x', `${x}%`);
        el.style.setProperty('--ripple-y', `${y}%`);
      });
    });
  }

  // ─── 8. ENHANCED COUNTER ANIMATION ─────────────────────
  function initCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.countTo, 10);
    const suffix = el.dataset.countSuffix || '';
    const prefix = el.dataset.countPrefix || '';
    const duration = parseInt(el.dataset.countDuration, 10) || 2000;
    const start = performance.now();

    el.classList.add('counting');

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quintic for smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 5);
      const current = Math.floor(ease * target);
      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        raf(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
        el.classList.remove('counting');
        el.classList.add('anim-ticker-done');
      }
    }
    raf(update);
  }

  // ─── 9. SMOOTH PAGE TRANSITIONS ────────────────────────
  function initPageTransitions() {
    if (isReducedMotion()) return;

    // Create overlay element
    let overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      document.body.appendChild(overlay);
    }

    // Animate out on page leave (wipe overlay)
    overlay.classList.add('leaving');

    // Intercept internal navigation links
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Only intercept local links (not external, not anchors, not javascript)
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || href.startsWith('tel') ||
          href.startsWith('javascript') || link.target === '_blank') return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.remove('leaving');

        // Force reflow
        void overlay.offsetWidth;

        overlay.classList.add('entering');

        overlay.addEventListener('animationend', () => {
          window.location.href = href;
        }, { once: true });
      });
    });
  }

  // ─── 10. TEXT SPLIT REVEAL ──────────────────────────────
  function initTextReveal() {
    const elements = document.querySelectorAll('[data-text-reveal]');
    elements.forEach(el => {
      const text = el.textContent;
      const words = text.split(' ');
      el.innerHTML = '';
      el.style.overflow = 'hidden';

      words.forEach((word, i) => {
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.overflow = 'hidden';
        wrapper.style.marginRight = '0.3em';

        const inner = document.createElement('span');
        inner.textContent = word;
        inner.style.display = 'inline-block';
        inner.style.transform = 'translateY(110%)';
        inner.style.transition = `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`;

        wrapper.appendChild(inner);
        el.appendChild(wrapper);
      });

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('span > span').forEach(span => {
            span.style.transform = 'translateY(0)';
          });
          observer.unobserve(el);
        }
      }, { threshold: 0.2 });
      observer.observe(el);
    });
  }

  // ─── 11. SMOOTH CURSOR FOLLOWER (Desktop only) ─────────
  function initCursorFollower() {
    if (isMobile() || isReducedMotion()) return;

    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    Object.assign(cursor.style, {
      position: 'fixed',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: '2px solid rgba(238, 71, 16, 0.5)',
      pointerEvents: 'none',
      zIndex: '99999',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.3s, height 0.3s, border-color 0.3s, background 0.3s',
      mixBlendMode: 'difference',
      opacity: '0'
    });
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    // Grow cursor on interactive elements
    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, .anim-magnetic';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.borderColor = 'rgba(238, 71, 16, 0.8)';
        cursor.style.background = 'rgba(238, 71, 16, 0.08)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderColor = 'rgba(238, 71, 16, 0.5)';
        cursor.style.background = 'transparent';
      });
    });

    // Smooth follow loop
    function followCursor() {
      cursorX = lerp(cursorX, mouseX, 0.15);
      cursorY = lerp(cursorY, mouseY, 0.15);
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      raf(followCursor);
    }
    followCursor();
  }

  // ─── 12. AUTO-ANNOTATE ELEMENTS (Smart class injection) ─
  // Automatically adds animation classes to common page elements
  // so the pages get animations without manually editing every tag
  function autoAnnotate() {
    // Section titles
    document.querySelectorAll('h2').forEach((el, i) => {
      if (!el.closest('header') && !el.closest('footer') && !el.closest('nav') &&
          !hasAnimClass(el)) {
        el.classList.add('anim-fade-up');
      }
    });

    // Section subtitles (p right after h2)
    document.querySelectorAll('h2 + p').forEach(el => {
      if (!hasAnimClass(el)) {
        el.classList.add('anim-fade-up', 'anim-delay-1');
      }
    });

    // Cards / grid children in main sections
    document.querySelectorAll('main section').forEach(section => {
      const grid = section.querySelector('[class*="grid"]');
      if (grid && !hasAnimClass(grid)) {
        const children = grid.children;
        Array.from(children).forEach((child, i) => {
          if (!hasAnimClass(child) && !child.querySelector('[class*="anim-"]')) {
            child.classList.add('anim-fade-up', `anim-delay-${Math.min(i + 1, 8)}`);
          }
        });
      }
    });

    // CTA buttons
    document.querySelectorAll('main button, main a[class*="bg-"]').forEach(el => {
      if (!hasAnimClass(el) && !el.closest('header') && !el.closest('nav')) {
        el.classList.add('anim-hover-bounce');
      }
    });

    // Benefit/service cards — add shine effect
    document.querySelectorAll('[class*="service-card"], [class*="benefit-card"], [class*="contact-card"], [class*="stat-card"]').forEach(el => {
      el.classList.add('anim-shine');
    });

    // Hero image
    document.querySelectorAll('main section:first-child img').forEach(el => {
      if (!hasAnimClass(el)) {
        const parent = el.closest('div');
        if (parent && !hasAnimClass(parent)) {
          parent.classList.add('anim-hero-image');
        }
      }
    });

    // Decorative blobs
    document.querySelectorAll('[class*="blur-3xl"]').forEach(el => {
      if (!el.classList.contains('anim-float') && !el.classList.contains('anim-float-slow')) {
        el.classList.add('anim-float');
      }
    });

    // Material icons in cards — wiggle on hover
    document.querySelectorAll('.material-symbols-outlined').forEach(el => {
      const parent = el.closest('[class*="card"], [class*="rounded-xl"]');
      if (parent && !el.classList.contains('anim-icon-wiggle')) {
        el.classList.add('anim-icon-wiggle');
        parent.classList.add('group');
      }
    });

    // Footer links
    document.querySelectorAll('footer a').forEach(el => {
      if (!el.classList.contains('anim-underline-grow')) {
        el.classList.add('anim-underline-grow');
      }
    });
  }

  function hasAnimClass(el) {
    return Array.from(el.classList).some(cls => cls.startsWith('anim-'));
  }

  // ─── INITIALIZATION ────────────────────────────────────
  function init() {
    if (isReducedMotion()) {
      // Still init counters and scroll progress for accessibility
      initScrollProgress();
      initCounters();
      return;
    }

    // Auto-annotate elements before initializing observers
    autoAnnotate();

    // Core animations
    initScrollReveal();
    initScrollProgress();
    initSmartHeader();
    initCounters();
    initTextReveal();

    // Desktop-only enhancements
    if (!isMobile()) {
      initParallax();
      initMagneticHover();
      initTiltEffect();
      initRipple();
      initCursorFollower();
    }

    // Page transitions (subtle)
    initPageTransitions();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
