/* ===========================================
   HOMEPAGE — "Who We Help" popup logic
=========================================== */
(function() {
  'use strict';

  // ===== Open modals when clicking a Who We Help card =====
  document.querySelectorAll('.who-card[data-who]').forEach(function(card) {
    card.addEventListener('click', function() {
      openModal('modal-who-' + card.getAttribute('data-who'));
    });
    // Keyboard support (Enter / Space) since cards act as buttons
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal('modal-who-' + card.getAttribute('data-who'));
      }
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
