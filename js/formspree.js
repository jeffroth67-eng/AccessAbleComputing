(function () {
  "use strict";

  function setStatus(el, message, isError) {
    if (!el) return;
    el.textContent = message || "";
    // Use role=alert for errors so screen readers announce immediately.
    el.setAttribute("role", isError ? "alert" : "status");
    el.setAttribute("aria-live", isError ? "assertive" : "polite");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector('form[aria-label="Contact form"]') || document.querySelector("form");
    if (!form) return;

    var statusEl = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-disabled", "true");
      }

      setStatus(statusEl, "Sending your message…", false);

      var formData = new FormData(form);

      fetch(form.action, {
        method: form.method || "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();

            // If reCAPTCHA is present, reset it (prevents confusion for keyboard users).
            if (window.grecaptcha && typeof window.grecaptcha.reset === "function") {
              try { window.grecaptcha.reset(); } catch (e) {}
            }

            setStatus(statusEl, "Thank you! Your message was sent successfully.", false);
          } else {
            return response.json().then(function (data) {
              var msg = (data && data.errors && data.errors.length)
                ? data.errors.map(function (e) { return e.message; }).join(" ")
                : "Sorry—something went wrong. Please try again.";
              setStatus(statusEl, msg, true);
            }).catch(function () {
              setStatus(statusEl, "Sorry—something went wrong. Please try again.", true);
            });
          }
        })
        .catch(function () {
          setStatus(statusEl, "Network error. Please check your connection and try again.", true);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.removeAttribute("aria-disabled");
          }
        });
    });
  });
})();