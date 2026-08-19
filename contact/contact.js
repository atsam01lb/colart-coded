/* ===========================================
   CONTACT PAGE — Terms modal, success modal,
   and the hidden-iframe FormSubmit flow
=========================================== */
(function() {
  'use strict';

  /* ===== Terms of Service modal ===== */
  var termsModal = document.getElementById('termsModal');

  function openTermsModal() {
    if (!termsModal) return;
    termsModal.classList.add('is-open');
    termsModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeTermsModal() {
    if (!termsModal) return;
    termsModal.classList.remove('is-open');
    termsModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-terms-open]').forEach(function(btn) {
    btn.addEventListener('click', openTermsModal);
  });
  document.querySelectorAll('[data-terms-close]').forEach(function(el) {
    el.addEventListener('click', closeTermsModal);
  });

  /* ===== Success modal ===== */
  var successModal = document.getElementById('successModal');

  function openSuccessModal() {
    if (!successModal) return;
    successModal.classList.add('is-open');
    successModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeSuccessModal() {
    if (!successModal) return;
    successModal.classList.remove('is-open');
    successModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-success-close]').forEach(function(el) {
    el.addEventListener('click', closeSuccessModal);
  });

  /* ===== ESC key closes whichever modal is open ===== */
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    if (termsModal && termsModal.classList.contains('is-open')) closeTermsModal();
    if (successModal && successModal.classList.contains('is-open')) closeSuccessModal();
  });

  /* =====================================================
     Contact form:
     - require at least one "Service Needed" checkbox
     - submit into the hidden iframe (FormSubmit.co)
     - the iframe also fires a "load" event once on the
       page's initial render (its blank starting document),
       so only react to "load" AFTER an actual submit
  ===================================================== */
  var form = document.getElementById('contactForm');
  var iframe = document.querySelector('.hidden-iframe');
  var serviceChecklist = document.getElementById('serviceChecklist');
  var didSubmit = false;

  if (form) {
    form.addEventListener('submit', function(e) {
      if (serviceChecklist) {
        var anyChecked = serviceChecklist.querySelectorAll('input[type="checkbox"]:checked').length > 0;
        if (!anyChecked) {
          e.preventDefault();
          alert('Please select at least one service.');
          return;
        }
      }
      didSubmit = true;
    });
  }

  if (iframe) {
    iframe.addEventListener('load', function() {
      if (!didSubmit) return;
      didSubmit = false;
      openSuccessModal();
      if (form) form.reset();
    });
  }
})();
