// Main: reveal-on-scroll and the "Enter Her World" button.
(function () {
  // Reveal elements once as they enter the viewport
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Smooth scroll for in-page buttons (nav links use CSS smooth scroll)
  document.querySelectorAll('[data-scroll]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
