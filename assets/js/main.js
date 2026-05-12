/* ===========================================
   COLART — DIGITAL MARKETING AGENCY
   main.js
=========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------
  // 1. Mobile menu
  // -------------------------------------------
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.textContent = '☰';
      });
    });
  }

  // -------------------------------------------
  // 2. Scroll-triggered reveal animations
  // -------------------------------------------
  const fadeTargets = document.querySelectorAll('.fade-in, .fade-in-stagger');

  if (fadeTargets.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeTargets.forEach(el => observer.observe(el));
  } else {
    // Fallback — show everything immediately if IntersectionObserver isn't supported
    fadeTargets.forEach(el => el.classList.add('visible'));
  }

  // -------------------------------------------
  // 3. Header shadow on scroll
  // -------------------------------------------
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => {
      if (window.pageYOffset > 50) {
        header.style.background = 'rgba(255, 255, 255, .96)';
        header.style.boxShadow = '0 2px 20px rgba(26, 20, 36, .06)';
      } else {
        header.style.background = 'rgba(255, 255, 255, .9)';
        header.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // -------------------------------------------
  // 4. Smooth scroll for in-page anchor links
  // -------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
