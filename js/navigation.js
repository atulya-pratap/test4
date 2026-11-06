// Navigation: highlights the active section as you scroll.
(function () {
  var links = document.querySelectorAll('[data-nav]');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });

  function setActive(id) {
    links.forEach(function (a) {
      a.classList.toggle('is-active', a === map[id]);
      if (a === map[id]) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();
