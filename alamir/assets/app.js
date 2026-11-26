(function () {
  // ---- reveal on scroll ----
  var secs = [].slice.call(document.querySelectorAll('.sec'));
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }) : null;
  secs.forEach(function (s) { if (io) io.observe(s); else s.classList.add('in'); });

  // ---- Call / WhatsApp buttons (driven by assets/config.js) ----
  var cfg = window.ALAMIR || {};
  var digits = String(cfg.phone || '').replace(/\D/g, '');
  if (!digits) return;

  var shown = '+' + digits;
  var tel = 'tel:+' + digits;
  var wa = 'https://wa.me/' + digits + '?text=' + encodeURIComponent(cfg.message || '');
  var SVG = 'http://www.w3.org/2000/svg';

  function btn(cls, href, label, path, blank) {
    var a = document.createElement('a');
    a.className = 'btn ' + cls; a.href = href;
    if (blank) { a.target = '_blank'; a.rel = 'noopener'; }
    var s = document.createElementNS(SVG, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(SVG, 'path'); p.setAttribute('fill', 'currentColor'); p.setAttribute('d', path);
    s.appendChild(p); a.appendChild(s);
    var t = document.createElement('span'); t.textContent = label; a.appendChild(t);
    return a;
  }
  var PHONE = 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z';
  var WA = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

  function fill(el) {
    if (!el) return;
    el.appendChild(btn('call', tel, 'Call now', PHONE, false));
    el.appendChild(btn('wa', wa, 'WhatsApp', WA, true));
    el.hidden = false;
  }
  fill(document.getElementById('dock'));
  var cta = document.getElementById('cta');
  if (cta) {
    fill(cta);
    var n = document.createElement('p'); n.className = 'ph-num'; n.setAttribute('dir', 'ltr'); n.textContent = shown;
    cta.parentNode.insertBefore(n, cta.nextSibling);
  }
  document.body.classList.add('has-dock');
})();
