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

  /* ============ CONTACT FORM SUBMIT ============ */
var contactForm = document.getElementById('contactForm');
var submitBtn = document.getElementById('contactSubmitBtn');
var hiddenIframe = document.querySelector('iframe[name="hidden_iframe"]');

var formHasSubmitted = false;

if (contactForm) {
  contactForm.addEventListener('submit', function () {
    formHasSubmitted = true;

    if (submitBtn) {
      submitBtn.disabled = true;

      var btnText = submitBtn.querySelector('span');
      if (btnText) {
        btnText.textContent = 'Sending...';
      }
    }
  });
}

if (hiddenIframe) {
  hiddenIframe.addEventListener('load', function () {
    if (!formHasSubmitted) return;

    contactForm.reset();
    openSuccessModal();

    if (submitBtn) {
      submitBtn.disabled = false;

      var btnText = submitBtn.querySelector('span');
      if (btnText) {
        btnText.textContent = 'Send Inquiry';
      }
    }

    formHasSubmitted = false;
  });
}
    });
  }
});
