document.addEventListener('DOMContentLoaded', function () {
  /* ============ TERMS OF SERVICE MODAL ============ */
  var termsModal = document.getElementById('termsModal');
  var termsOpenBtns = document.querySelectorAll('[data-terms-open]');
  var termsCloseBtns = document.querySelectorAll('[data-terms-close]');

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

  termsOpenBtns.forEach(function (btn) {
    btn.addEventListener('click', openTermsModal);
  });
  termsCloseBtns.forEach(function (btn) {
    btn.addEventListener('click', closeTermsModal);
  });

  /* ============ SUCCESS MODAL ============ */
  var successModal = document.getElementById('successModal');
  var successCloseBtns = document.querySelectorAll('[data-success-close]');

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

  successCloseBtns.forEach(function (btn) {
    btn.addEventListener('click', closeSuccessModal);
  });

  /* ============ CONTACT FORM SUBMIT (AJAX) ============ */
  var contactForm = document.getElementById('contactForm');
  var submitBtn = document.getElementById('contactSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';
      }

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            contactForm.reset();
            openSuccessModal();
          } else {
            alert('Something went wrong sending your message. Please try again or reach us on WhatsApp.');
          }
        })
        .catch(function () {
          alert('Something went wrong sending your message. Please try again or reach us on WhatsApp.');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Send Inquiry';
          }
        });
    });
  }
});
