/* ===========================================
   OUR WORK PAGE — MODAL LOGIC
=========================================== */
(function() {
  'use strict';
 
  // ===== Open modals when clicking brand cards =====
  document.querySelectorAll('.brand-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var brand = card.getAttribute('data-brand');
      if (!brand) return;
      openModal('modal-' + brand);
    });
  });
 
  // ===== Open "View All" modal buttons =====
  document.querySelectorAll('.btn-view-all').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.getAttribute('data-modal');
      if (!target) return;
      openModal('modal-' + target);
    });
  });
 
  // ===== Close on backdrop click or close button =====
  document.querySelectorAll('[data-close-modal]').forEach(function(el) {
    el.addEventListener('click', function() {
      closeAllModals();
    });
  });
 
  // ===== Close on ESC key =====
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAllModals();
  });
 
  // ===== Helper functions =====
  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Scroll modal to top
    var content = modal.querySelector('.work-modal-content');
    if (content) content.scrollTop = 0;
  }
 
  function closeAllModals() {
    document.querySelectorAll('.work-modal.is-open').forEach(function(m) {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }
 
  // ===== Smooth scroll for the in-page anchor link from hero =====
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var headerHeight = 80;
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
 
  // ===== Handle missing images gracefully (e.g. 032.png placeholder) =====
  document.querySelectorAll('.modal-logo-cell img, .logo-preview-card img, .modal-social-cell img, .social-preview-card img').forEach(function(img) {
    img.addEventListener('error', function() {
      // Hide cell if image fails to load
      var cell = img.closest('.modal-logo-cell, .logo-preview-card, .modal-social-cell, .social-preview-card');
      if (cell) cell.style.display = 'none';
    });
  });
 
})();
