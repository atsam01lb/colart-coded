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
    if (
      e.key === 'Escape' &&
      termsModal &&
      termsModal.classList.contains('is-open')
    ) {
      closeTerms();
    }
  });

  // ===== CONTACT FORM =====

  var form = document.getElementById('contactForm');

  if (!form) return;

  var WHATSAPP_NUMBER = '96170649423';

  form.addEventListener('submit', function () {

    // Get form values

    var fullName = (
      document.getElementById('fullName').value || ''
    ).trim();

    var emailAddress = (
      document.getElementById('emailAddress').value || ''
    ).trim();

    var phoneNumber = (
      document.getElementById('phoneNumber').value || ''
    ).trim();

    var serviceNeeded =
      document.getElementById('serviceNeeded').value || '';

    var projectDetails = (
      document.getElementById('projectDetails').value || ''
    ).trim();

    // Build WhatsApp message

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

    var waText = encodeURIComponent(
      lines.join('\n')
    );

    var waUrl =
      'https://wa.me/' +
      WHATSAPP_NUMBER +
      '?text=' +
      waText;

    // Open WhatsApp after form submission starts

    setTimeout(function () {

      window.open(
        waUrl,
        '_blank',
        'noopener'
      );

    }, 1000);

  });

})();
