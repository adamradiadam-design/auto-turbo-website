document.addEventListener('DOMContentLoaded', function () {
  /* =========================================================
     STICKY NAVIGATION
     ========================================================= */
  var nav = document.getElementById('nav');
  function updateNavState() {
    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  updateNavState();
  window.addEventListener('scroll', updateNavState, { passive: true });

  /* =========================================================
     MOBILE MENU
     ========================================================= */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    navLinks.classList.remove('is-open');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Ouvrir le menu' : 'Fermer le menu');
    navLinks.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); }
  });

  /* =========================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================= */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* =========================================================
     HERO GAUGE ANIMATION (signature element)
     ========================================================= */
  var gaugeValue = document.getElementById('gaugeValue');
  if (gaugeValue) {
    var circumference = 2 * Math.PI * 82; /* r = 82 */
    var targetOffset = circumference * 0.22; /* ~78% filled, like a boost gauge in the healthy zone */
    requestAnimationFrame(function () {
      setTimeout(function () {
        gaugeValue.style.strokeDashoffset = String(targetOffset);
      }, 400);
    });
  }

  /* =========================================================
     BACK TO TOP BUTTON
     ========================================================= */
  var backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (window.scrollY > 480) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }
  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================================
     CONTACT FORM VALIDATION
     ========================================================= */
  var form = document.getElementById('contactForm');
  var successMessage = document.getElementById('formSuccess');

  var validators = {
    fName: function (value) {
      return value.trim().length >= 2 ? '' : 'Veuillez indiquer votre nom complet.';
    },
    fPhone: function (value) {
      var cleaned = value.replace(/[\s.-]/g, '');
      var phonePattern = /^(\+212|0)[5-7]\d{8}$/;
      return phonePattern.test(cleaned) ? '' : 'Veuillez indiquer un numéro de téléphone valide.';
    },
    fEmail: function (value) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value.trim()) ? '' : 'Veuillez indiquer une adresse e-mail valide.';
    },
    fVehicle: function (value) {
      return value.trim().length >= 2 ? '' : 'Veuillez indiquer le modèle de votre véhicule.';
    },
    fMessage: function (value) {
      return value.trim().length >= 10 ? '' : 'Veuillez décrire votre besoin (10 caractères minimum).';
    }
  };

  function validateField(id) {
    var field = document.getElementById(id);
    var errorEl = document.getElementById('err-' + id);
    var message = validators[id](field.value);

    field.closest('.form__row').classList.toggle('has-error', Boolean(message));
    errorEl.textContent = message;

    return message === '';
  }

  Object.keys(validators).forEach(function (id) {
    var field = document.getElementById(id);
    field.addEventListener('blur', function () { validateField(id); });
    field.addEventListener('input', function () {
      if (field.closest('.form__row').classList.contains('has-error')) {
        validateField(id);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fieldIds = Object.keys(validators);
    var isValid = fieldIds.reduce(function (acc, id) {
      var fieldIsValid = validateField(id);
      return acc && fieldIsValid;
    }, true);

    if (!isValid) {
      var firstError = form.querySelector('.has-error input, .has-error textarea');
      if (firstError) { firstError.focus(); }
      return;
    }

    /* No backend is connected to this demo: we simply confirm
       receipt of the request to the visitor. */
    form.querySelectorAll('input, textarea, button').forEach(function (el) {
      el.disabled = true;
    });
    successMessage.hidden = false;
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

});
