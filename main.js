/* ============================================================
   DAVAST ABOGADOS — main.js
   IIFE pattern — no ES modules, no imports, no exports
   ============================================================ */
(function () {
  "use strict";

  /* ---- SAFE WRAPPER ---- */
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ---- SPLASH ---- */
  function initSplash() {
    var splash = document.querySelector("[data-splash]");
    if (!splash) return;
    function hide() {
      splash.classList.add("is-out");
      setTimeout(function () {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 800);
    }
    if (document.readyState === "complete") {
      setTimeout(hide, 600);
    } else {
      window.addEventListener("load", function () { setTimeout(hide, 400); });
    }
    setTimeout(hide, 4000);
  }

  /* ---- NAV ---- */
  function initNav() {
    var nav = document.getElementById("nav");
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 40) {
        nav.classList.add("is-solid");
      } else {
        nav.classList.remove("is-solid");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* hamburger */
    var btn = nav.querySelector(".nav-hamburger");
    var menu = document.getElementById("mobile-menu");
    if (btn && menu) {
      btn.addEventListener("click", function () {
        var open = btn.classList.toggle("is-open");
        menu.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        menu.setAttribute("aria-hidden", open ? "false" : "true");
        menu.style.display = open ? "flex" : "";
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          btn.classList.remove("is-open");
          menu.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
          menu.setAttribute("aria-hidden", "true");
        });
      });
    }
  }

  /* ---- SMOOTH SCROLL ---- */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 80;
      var top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ---- REVEAL (IntersectionObserver) ---- */
  function initReveals() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.opacity = "";
          el.style.transform = "";
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });

    els.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 0.08) + "s";
      io.observe(el);
    });

    /* safety net at 6s */
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ---- COUNT-UP (GSAP) ---- */
  function initCounters() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll("[data-count-to]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count-to"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      var obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: function () {
          el.textContent = Math.round(obj.val) + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true
        }
      });
    });
  }

  /* ---- GSAP SCROLL REVEALS ---- */
  function initGsapReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;

    /* Marquee pause on hover */
    var track = document.querySelector(".marquee-track");
    if (track) {
      var band = document.querySelector(".marquee-band");
      if (band) {
        band.addEventListener("mouseover", function () {
          track.style.animationPlayState = "paused";
        });
        band.addEventListener("mouseout", function () {
          track.style.animationPlayState = "running";
        });
      }
    }

    /* Steps use the reveal IntersectionObserver — nothing extra needed here */
  }

  /* ---- FLIP CARDS ---- */
  function initFlipCards() {
    var cards = document.querySelectorAll(".flip-card");
    cards.forEach(function (card) {
      /* touch / click toggle */
      card.addEventListener("click", function () {
        /* on desktop, CSS hover handles it; on touch, toggle class */
        if (matchMedia("(hover: none)").matches) {
          card.classList.toggle("is-flipped");
        }
      });
      /* keyboard */
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.classList.toggle("is-flipped");
        }
        if (e.key === "Escape") {
          card.classList.remove("is-flipped");
        }
      });
    });
  }

  /* ---- ÁREA CARDS ---- */
  function initAreaCards() {
    var cards = document.querySelectorAll(".area-card");
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var isOpen = card.classList.contains("is-open");
        cards.forEach(function (c) {
          c.classList.remove("is-open");
          c.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          card.classList.add("is-open");
          card.setAttribute("aria-expanded", "true");
        }
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
        if (e.key === "Escape") {
          card.classList.remove("is-open");
          card.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* ---- FORM ---- */
  function initForm() {
    var form = document.getElementById("contacto-form");
    var submitBtn = document.getElementById("form-submit-btn");
    var errorMsg = form ? form.querySelector(".form-error-msg") : null;
    if (!form || !submitBtn) return;

    function setError(msg) {
      if (errorMsg) errorMsg.textContent = msg;
    }
    function clearError() {
      if (errorMsg) errorMsg.textContent = "";
    }

    function validate() {
      var nombre   = form.querySelector("#f-nombre");
      var apellidos = form.querySelector("#f-apellidos");
      var email    = form.querySelector("#f-email");
      var area     = form.querySelector("#f-area");
      var desc     = form.querySelector("#f-descripcion");
      var privacy  = form.querySelector("#f-privacidad");

      /* clear previous errors */
      form.querySelectorAll(".is-error").forEach(function (el) { el.classList.remove("is-error"); });
      clearError();

      if (!nombre.value.trim()) {
        nombre.classList.add("is-error");
        setError("Por favor, indique su nombre.");
        nombre.focus();
        return false;
      }
      if (!apellidos.value.trim()) {
        apellidos.classList.add("is-error");
        setError("Por favor, indique sus apellidos.");
        apellidos.focus();
        return false;
      }
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRe.test(email.value)) {
        email.classList.add("is-error");
        setError("Por favor, introduzca un email válido.");
        email.focus();
        return false;
      }
      if (!area.value) {
        area.classList.add("is-error");
        setError("Seleccione el área jurídica de interés.");
        area.focus();
        return false;
      }
      if (!desc.value.trim() || desc.value.trim().length < 20) {
        desc.classList.add("is-error");
        setError("Por favor, describa brevemente su situación (mínimo 20 caracteres).");
        desc.focus();
        return false;
      }
      if (!privacy.checked) {
        setError("Debe aceptar la política de privacidad para continuar.");
        privacy.closest(".checkbox-label").querySelector(".checkbox-custom").style.borderColor = "var(--red)";
        return false;
      }
      return true;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");

      /* Simulated send — replace with fetch() to your endpoint */
      setTimeout(function () {
        submitBtn.classList.remove("is-loading");
        submitBtn.classList.add("is-success");
        setError("");
        /* Scroll to confirmation */
        submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });

        /* Reset after delay */
        setTimeout(function () {
          form.reset();
          submitBtn.classList.remove("is-success");
          submitBtn.disabled = false;
        }, 6000);
      }, 1800);
    });

    /* Live validation on blur */
    var requiredInputs = form.querySelectorAll("input[required], select[required], textarea[required]");
    requiredInputs.forEach(function (input) {
      input.addEventListener("blur", function () {
        if (input.classList.contains("is-error") && input.value.trim()) {
          input.classList.remove("is-error");
          clearError();
        }
      });
    });
  }

  /* ---- BOOT ---- */
  function boot() {
    safe(initSplash,       "initSplash");
    safe(initNav,          "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initFlipCards,    "initFlipCards");
    safe(initAreaCards,    "initAreaCards");
    safe(initForm,         "initForm");
    safe(initReveals,      "initReveals");
    safe(initCounters,     "initCounters");
    safe(initGsapReveals,  "initGsapReveals");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
