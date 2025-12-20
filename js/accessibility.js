// Accessibility Tools (keyboard and screen-reader friendly)
(function () {
  const root = document.documentElement;

  const STORAGE_KEYS = {
    fontSize: "aac_fontSizePercent",
    highContrast: "aac_highContrast"
  };

  function getNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  // Restore saved preferences
  let fontSize = getNumber(localStorage.getItem(STORAGE_KEYS.fontSize), 100);
  fontSize = Math.max(70, Math.min(fontSize, 200));
  root.style.fontSize = fontSize + "%";

  const savedContrast = localStorage.getItem(STORAGE_KEYS.highContrast);
  let highContrast = savedContrast === "true";

  if (highContrast) {
    document.body.classList.add("high-contrast");
  }

  // Wire up buttons (if present)
  const incBtn = document.getElementById("increase-font");
  const decBtn = document.getElementById("decrease-font");
  const contrastBtn = document.getElementById("toggle-contrast");
  const readBtn = document.getElementById("read-aloud");

  if (incBtn) {
    incBtn.addEventListener("click", () => {
      fontSize = Math.min(fontSize + 10, 200);
      root.style.fontSize = fontSize + "%";
      localStorage.setItem(STORAGE_KEYS.fontSize, String(fontSize));
    });
  }

  if (decBtn) {
    decBtn.addEventListener("click", () => {
      fontSize = Math.max(fontSize - 10, 70);
      root.style.fontSize = fontSize + "%";
      localStorage.setItem(STORAGE_KEYS.fontSize, String(fontSize));
    });
  }

  if (contrastBtn) {
    contrastBtn.addEventListener("click", () => {
      highContrast = !highContrast;
      document.body.classList.toggle("high-contrast", highContrast);
      localStorage.setItem(STORAGE_KEYS.highContrast, String(highContrast));
    });
  }

  if (readBtn) {
    readBtn.addEventListener("click", () => {
      const main = document.getElementById("main-content");
      if (window.speechSynthesis && main) {
        const text = (main.innerText || main.textContent || "").trim();
        const utterance = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } else {
        alert("Sorry, your browser does not support speech synthesis.");
      }
    });
  }

  // Dynamic copyright text
  const copyrightEl = document.getElementById("copyright");
  if (copyrightEl) {
    const year = new Date().getFullYear();
    copyrightEl.textContent = `© ${year} Access Able Computing LLC. All rights reserved.`;
  }

// High-contrast mode CSS (kept to preserve existing behavior)
  const style = document.createElement("style");
  style.innerHTML = `
    body.high-contrast {
      background: #000 !important;
      color: #fff !important;
    }
    body.high-contrast header[role="banner"] {
      background: #000 !important;
      border-bottom: 2px solid #ff0 !important;
    }
    body.high-contrast a,
    body.high-contrast .nav-list li a,
    body.high-contrast .footer-nav-list a {
      color: #ff0 !important;
    }
    body.high-contrast .nav-list a[aria-current="page"] {
      background: rgba(255,255,0,0.2) !important;
    }
    body.high-contrast .accessibility-tools button {
      background: #fff !important;
      color: #000 !important;
      border: 2px solid #ff0 !important;
    }
    body.high-contrast footer {
      background: #000 !important;
      color: #fff !important;
      border-top: 2px solid #ff0 !important;
    }
  `;
  document.head.appendChild(style);
})();
