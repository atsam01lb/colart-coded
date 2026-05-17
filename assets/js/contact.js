/* ===========================================
   CONTACT PAGE — FORM + WHATSAPP + TERMS MODAL
=========================================== */
(function () {
  'use strict';

  // ===== TERMS OF SERVICE MODAL =====
  var termsModal = document.getElementById('termsModal');

  function openTerms() {
    if (!termsModal) return;
    termsModal.classList.add('is-open');
    termsModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeTerms() {
    if (!termsModal) return;
    termsModal.classList.remove('is-open');
    termsModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-terms-open]').forEach(function (el) {
    el.addEventListener('click', openTerms);
  });

  document.querySelectorAll('[data-terms-close]').forEach(function (el) {
    el.addEventListener('click', closeTerms);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && termsModal && termsModal.classList.contains('is-open')) {
      closeTerms();
    }
  });

  // ===== CONTACT FORM — DUAL SEND (Email via FormSubmit + WhatsApp) =====
  var form = document.getElementById('contactForm');
  if (!form) return;

  var WHATSAPP_NUMBER = '96170649423'; // +961 70 64 94 23

  form.addEventListener('submit', function () {
    // The form already submits to FormSubmit via target="hidden_iframe" — that handles the email.
    // We just need to also open WhatsApp with the same details. Wait a tick so the form posts first.
    setTimeout(function () {
      var fullName     = (document.getElementById('fullName').value || '').trim();
      var emailAddress = (document.getElementById('emailAddress').value || '').trim();
      var phoneNumber  = (document.getElementById('phoneNumber').value || '').trim();
      var serviceNeeded = document.getElementById('serviceNeeded').value || '';
      var projectDetails = (document.getElementById('projectDetails').value || '').trim();

      var lines = [
        'Hello Colart, I just sent an inquiry through your website.',
        '',
        '*Full Name:* ' + fullName,
        '*Email:* ' + emailAddress,
        '*Phone:* ' + phoneNumber,
        '*Service Needed:* ' + serviceNeeded,
        '',
        '*Project Details:*',
        projectDetails
      ];

      var waText = encodeURIComponent(lines.join('\n'));
      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waText;

      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank', 'noopener');

      // Show a friendly success state on the form
      showSuccessMessage();

      // Reset the form
      form.reset();
    }, 250);
  });

  function showSuccessMessage() {
    var existing = document.getElementById('contactSuccessBanner');
    if (existing) existing.remove();

    var banner = document.createElement('div');
    banner.id = 'contactSuccessBanner';
    banner.className = 'contact-success-banner';
    banner.innerHTML =
      '<i class="fa-solid fa-circle-check"></i>' +
      '<div>' +
      '<strong>Inquiry sent.</strong>' +
      '<span>WhatsApp should also have opened in a new tab. We\'ll get back to you shortly.</span>' +
      '</div>';

    form.parentNode.insertBefore(banner, form);

    // Scroll the banner into view
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-fade after 10 seconds
    setTimeout(function () {
      banner.classList.add('fade-out');
      setTimeout(function () {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 600);
    }, 10000);
  }

})();
