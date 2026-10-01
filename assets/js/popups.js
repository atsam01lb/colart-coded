/* ===========================================
   SHARED POPUP LOGIC
   Generic modal opener for any element carrying
   a data-modal-target="modal-id" attribute.
   Used on service pages and the Products page.
=========================================== */
(function() {
  'use strict';

  document.querySelectorAll('[data-modal-target]').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('a')) return; // let inner links behave normally
      openModal(card.getAttribute('data-modal-target'));
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a')) return;
        e.preventDefault();
        openModal(card.getAttribute('data-modal-target'));
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function(el) {
    el.addEventListener('click', function() {
      closeAllModals();
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAllModals();
  });

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
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

})();
