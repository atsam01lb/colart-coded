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

  // ===== Open modals when clicking results stat cards =====
  document.querySelectorAll('.stat-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('a')) return;
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

  // ===== Close on ESC key (photo lightbox takes priority over the popup behind it) =====
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    var lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('is-open')) {
      closeLightbox();
      return;
    }
    closeAllModals();
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
  document.querySelectorAll('.modal-logo-cell img, .logo-preview-card img, .modal-social-cell img, .social-preview-card img, .work-modal-gallery-carousel img, .work-modal-gallery-menu img').forEach(function(img) {
    img.addEventListener('error', function() {
      // Hide cell if image fails to load
      var cell = img.closest('.modal-logo-cell, .logo-preview-card, .modal-social-cell, .social-preview-card, .work-modal-gallery-carousel figure, .work-modal-gallery-menu figure');
      if (cell) cell.style.display = 'none';
    });
  });

  // ===========================================
  // PHOTO LIGHTBOX — full-screen view with zoom
  // and swipe navigation for every popup gallery
  // ===========================================
  var lightbox = document.getElementById('lightbox');
  var lbStage, lbImg, lbCaption, lbCounter, lbPrev, lbNext;
  var lbImages = [];
  var lbIndex = 0;
  var lbScale = 1;
  var lbTranslateX = 0;
  var lbTranslateY = 0;
  var lbDragging = false;
  var lbDragStartX = 0, lbDragStartY = 0, lbDragOriginX = 0, lbDragOriginY = 0;
  var lbPinchStartDist = 0, lbPinchStartScale = 1;
  var lbSwipeStartX = null, lbSwipeStartY = null;
  var lbLastTap = 0;

  if (lightbox) {
    lbStage = document.getElementById('lightboxStage');
    lbImg = document.getElementById('lightboxImg');
    lbCaption = document.getElementById('lightboxCaption');
    lbCounter = document.getElementById('lightboxCounter');
    lbPrev = document.getElementById('lightboxPrev');
    lbNext = document.getElementById('lightboxNext');

    // Open the lightbox whenever a gallery photo inside any popup is clicked
    document.addEventListener('click', function(e) {
      var img = e.target.closest ? e.target.closest('.work-modal-gallery img, .work-modal-logo-grid img, .work-modal-social-grid img') : null;
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      var gallery = collectLightboxGallery(img);
      if (gallery) openLightbox(gallery.list, gallery.index);
    });

    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function(el) {
      el.addEventListener('click', closeLightbox);
    });
    // The stage sits on top of the backdrop (it needs full-viewport hit area to
    // catch swipes/drags), so clicking the empty space around the photo has to
    // close via the stage itself — but only when the click didn't land on the
    // photo or a control, which would have its own target, not the stage.
    lbStage.addEventListener('click', function(e) {
      if (e.target === lbStage) closeLightbox();
    });
    lbPrev.addEventListener('click', function(e) { e.stopPropagation(); showLightboxImage(lbIndex - 1); });
    lbNext.addEventListener('click', function(e) { e.stopPropagation(); showLightboxImage(lbIndex + 1); });

    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'ArrowRight') showLightboxImage(lbIndex + 1);
      else if (e.key === 'ArrowLeft') showLightboxImage(lbIndex - 1);
    });

    lbImg.addEventListener('dblclick', function(e) {
      e.preventDefault();
      toggleLightboxZoom();
    });

    // Desktop scroll-wheel zoom
    lbStage.addEventListener('wheel', function(e) {
      if (!lightbox.classList.contains('is-open')) return;
      e.preventDefault();
      var next = clampLightboxScale(lbScale + (e.deltaY > 0 ? -0.15 : 0.15));
      if (next === 1) { lbTranslateX = 0; lbTranslateY = 0; }
      lbScale = next;
      lbImg.classList.toggle('is-zoomed', lbScale > 1);
      applyLightboxTransform();
    }, { passive: false });

    // Desktop drag-to-pan once zoomed in
    lbImg.addEventListener('mousedown', function(e) {
      if (lbScale <= 1) return;
      lbDragging = true;
      lbImg.classList.add('is-dragging');
      lbDragStartX = e.clientX;
      lbDragStartY = e.clientY;
      lbDragOriginX = lbTranslateX;
      lbDragOriginY = lbTranslateY;
      e.preventDefault();
    });
    window.addEventListener('mousemove', function(e) {
      if (!lbDragging) return;
      lbTranslateX = lbDragOriginX + (e.clientX - lbDragStartX);
      lbTranslateY = lbDragOriginY + (e.clientY - lbDragStartY);
      applyLightboxTransform();
    });
    window.addEventListener('mouseup', function() {
      if (!lbDragging) return;
      lbDragging = false;
      lbImg.classList.remove('is-dragging');
    });

    // Touch: swipe to browse, drag to pan when zoomed, pinch to zoom, double-tap to zoom
    lbStage.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        lbPinchStartDist = lightboxTouchDistance(e.touches);
        lbPinchStartScale = lbScale;
      } else if (e.touches.length === 1) {
        lbSwipeStartX = e.touches[0].clientX;
        lbSwipeStartY = e.touches[0].clientY;
        lbDragStartX = e.touches[0].clientX;
        lbDragStartY = e.touches[0].clientY;
        lbDragOriginX = lbTranslateX;
        lbDragOriginY = lbTranslateY;
        var now = Date.now();
        if (now - lbLastTap < 300) toggleLightboxZoom();
        lbLastTap = now;
      }
    }, { passive: true });

    lbStage.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var dist = lightboxTouchDistance(e.touches);
        lbScale = clampLightboxScale(lbPinchStartScale * (dist / lbPinchStartDist));
        lbImg.classList.toggle('is-zoomed', lbScale > 1);
        applyLightboxTransform();
      } else if (e.touches.length === 1 && lbScale > 1) {
        e.preventDefault();
        lbTranslateX = lbDragOriginX + (e.touches[0].clientX - lbDragStartX);
        lbTranslateY = lbDragOriginY + (e.touches[0].clientY - lbDragStartY);
        applyLightboxTransform();
      }
    }, { passive: false });

    lbStage.addEventListener('touchend', function(e) {
      if (lbScale <= 1 && lbSwipeStartX !== null && e.changedTouches && e.changedTouches.length) {
        var dx = e.changedTouches[0].clientX - lbSwipeStartX;
        var dy = e.changedTouches[0].clientY - lbSwipeStartY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          showLightboxImage(lbIndex + (dx < 0 ? 1 : -1));
        }
      }
      lbSwipeStartX = null;
      lbSwipeStartY = null;
    });
  }

  function collectLightboxGallery(imgNode) {
    var modalContent = imgNode.closest('.work-modal-content');
    if (!modalContent) return null;
    var nodes = Array.prototype.slice.call(modalContent.querySelectorAll('img'));
    var list = nodes.map(function(node) {
      var fig = node.closest('figure');
      var caption = fig ? fig.querySelector('figcaption') : null;
      return {
        src: node.getAttribute('src'),
        alt: node.getAttribute('alt') || '',
        caption: caption ? caption.textContent.trim() : ''
      };
    });
    var index = nodes.indexOf(imgNode);
    return { list: list, index: index < 0 ? 0 : index };
  }

  function openLightbox(list, index) {
    if (!list || !list.length) return;
    lbImages = list;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showLightboxImage(index);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    resetLightboxZoom();
    if (!document.querySelector('.work-modal.is-open')) document.body.style.overflow = '';
  }

  function showLightboxImage(index) {
    if (!lbImages.length) return;
    lbIndex = (index + lbImages.length) % lbImages.length;
    var item = lbImages[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.caption || item.alt || '';
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
    var multiple = lbImages.length > 1;
    lbPrev.style.display = multiple ? 'grid' : 'none';
    lbNext.style.display = multiple ? 'grid' : 'none';
    resetLightboxZoom();
  }

  function resetLightboxZoom() {
    lbScale = 1;
    lbTranslateX = 0;
    lbTranslateY = 0;
    applyLightboxTransform();
    if (lbImg) lbImg.classList.remove('is-zoomed');
  }

  function applyLightboxTransform() {
    if (lbImg) lbImg.style.transform = 'translate(' + lbTranslateX + 'px,' + lbTranslateY + 'px) scale(' + lbScale + ')';
  }

  function clampLightboxScale(s) {
    return Math.min(4, Math.max(1, s));
  }

  function toggleLightboxZoom() {
    if (lbScale > 1) {
      resetLightboxZoom();
    } else {
      lbScale = 2.2;
      lbTranslateX = 0;
      lbTranslateY = 0;
      applyLightboxTransform();
      lbImg.classList.add('is-zoomed');
    }
  }

  function lightboxTouchDistance(touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

})();
