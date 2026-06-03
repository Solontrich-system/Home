/* ═══════════════════════════════════════════════
   MYAPPS — app.js
   Handles: sticky header, mobile nav, reveal
   animations, card shine effect, smooth scroll
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM REFERENCES ───────────────────────────
  const header     = document.getElementById('site-header');
  const hamburger  = document.getElementById('hamburger');
  const navDrawer  = document.getElementById('nav-drawer');
  const backdrop   = document.getElementById('nav-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');
  const appCards   = document.querySelectorAll('.app-card');
  const revealEls  = document.querySelectorAll('.reveal');

  // ── STICKY HEADER ────────────────────────────
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init

  // ── MOBILE NAV DRAWER ────────────────────────
  function openDrawer() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navDrawer.classList.add('open');
    navDrawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navDrawer.classList.remove('open');
    navDrawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navDrawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // ── INTERSECTION OBSERVER — REVEAL ───────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // ── CARD SHINE EFFECT ────────────────────────
  // Tracks mouse position within each card for the
  // radial-gradient shine layer.
  function addCardShine(card) {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = ((e.clientX - rect.left) / rect.width)  * 100;
      const y      = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  }

  appCards.forEach(addCardShine);

  // ── SMOOTH SCROLL for anchor links ───────────
  // Offsets for fixed header height
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = header.offsetHeight;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── RESIZE: auto-close drawer on desktop ─────
  const mq = window.matchMedia('(min-width: 768px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) closeDrawer();
  });

  // ── ACTIVE NAV LINK on scroll ─────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';
    const scrollY = window.scrollY + header.offsetHeight + 40;

    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ── PARALLAX — subtle hero orb on scroll ─────
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  function onScrollParallax() {
    const sy = window.scrollY;
    if (orb1) orb1.style.transform = `translate(0, ${sy * 0.12}px)`;
    if (orb2) orb2.style.transform = `translate(0, ${sy * -0.08}px)`;
  }

  // Only run parallax on desktop (respects reduced motion via CSS)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', onScrollParallax, { passive: true });
  }

})();
