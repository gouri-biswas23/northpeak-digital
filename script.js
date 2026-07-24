/* ==========================================================================
   NorthPeak Digital — Script
   Vanilla JS only: nav toggle, scroll reveal, accordion, form validation
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      primaryNav.classList.toggle("open", !isOpen);
    });

    primaryNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("open");
      }
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById("siteHeader");

  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.style.boxShadow = y > 8 ? "0 4px 20px rgba(13,27,42,0.08)" : "none";
    }
    toggleBackToTop(y);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Back to top button ---------- */
  var backToTop = document.getElementById("backToTop");

  function toggleBackToTop(y) {
    if (!backToTop) return;
    if (y > 700) {
      backToTop.hidden = false;
      requestAnimationFrame(function () { backToTop.classList.add("visible"); });
    } else {
      backToTop.classList.remove("visible");
    }
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal (fade-up) ---------- */
  var revealItems = document.querySelectorAll(".fade-up");

  if ("IntersectionObserver" in window && revealItems.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = (i % 3) * 90;
            setTimeout(function () { el.classList.add("is-visible"); }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- FAQ Accordion ---------- */
  var accordion = document.getElementById("accordion");

  if (accordion) {
    var triggers = accordion.querySelectorAll(".accordion-trigger");

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        var panel = document.getElementById(trigger.getAttribute("aria-controls"));

        /* Close all other panels for a clean single-open accordion */
        triggers.forEach(function (other) {
          if (other !== trigger) {
            other.setAttribute("aria-expanded", "false");
            var otherPanel = document.getElementById(other.getAttribute("aria-controls"));
            if (otherPanel) {
              otherPanel.hidden = true;
            }
          }
        });

        trigger.setAttribute("aria-expanded", String(!expanded));

        if (panel) {
          panel.hidden = expanded;
        }
      });
    });
  }

  /* ---------- Contact form validation ---------- */
  var contactForm = document.getElementById("contactForm");

  if (contactForm) {
    var formSuccess = document.getElementById("formSuccess");

    var fields = {
      name: { input: document.getElementById("name"), error: document.getElementById("name-error") },
      email: { input: document.getElementById("email"), error: document.getElementById("email-error") },
      message: { input: document.getElementById("message"), error: document.getElementById("message-error") }
    };

    function setError(field, message) {
      field.input.closest(".form-field").classList.add("has-error");
      field.error.textContent = message;
    }

    function clearError(field) {
      field.input.closest(".form-field").classList.remove("has-error");
      field.error.textContent = "";
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateField(key) {
      var field = fields[key];
      var value = field.input.value.trim();

      if (!value) {
        setError(field, "This field is required.");
        return false;
      }

      if (key === "email" && !isValidEmail(value)) {
        setError(field, "Please enter a valid email address.");
        return false;
      }

      clearError(field);
      return true;
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].input.addEventListener("blur", function () { validateField(key); });
      fields[key].input.addEventListener("input", function () {
        if (fields[key].input.closest(".form-field").classList.contains("has-error")) {
          validateField(key);
        }
      });
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var validName = validateField("name");
      var validEmail = validateField("email");
      var validMessage = validateField("message");

      if (validName && validEmail && validMessage) {
        contactForm.reset();
        if (formSuccess) {
          formSuccess.hidden = false;
          if (formSuccess.focus) formSuccess.focus();
        }
      } else {
        var firstInvalid = contactForm.querySelector(".has-error input, .has-error textarea");
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  /* ---------- Newsletter form ---------- */
  var newsletterForm = document.getElementById("newsletterForm");

  if (newsletterForm) {
    var newsletterSuccess = document.getElementById("newsletterSuccess");

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailInput = document.getElementById("newsletter-email");

      if (emailInput && emailInput.checkValidity()) {
        newsletterForm.reset();
        if (newsletterSuccess) newsletterSuccess.hidden = false;
      }
    });
  }

})();