(function () {
  const STORAGE_KEY = "atelier-roble-cookie-consent";
  const banner = document.getElementById("cookieBanner");
  if (!banner) return;

  function readChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      return;
    }
    banner.classList.remove("is-visible");
    window.setTimeout(() => {
      banner.hidden = true;
    }, 350);
  }

  function showBanner() {
    banner.hidden = false;
    window.requestAnimationFrame(() => banner.classList.add("is-visible"));
  }

  if (!readChoice()) showBanner();

  banner.querySelector("[data-cookie-accept]").addEventListener("click", () => saveChoice("accepted"));
  banner.querySelector("[data-cookie-reject]").addEventListener("click", () => saveChoice("rejected"));

  document.querySelectorAll("[data-cookie-settings]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      showBanner();
      banner.querySelector("[data-cookie-accept]").focus();
    });
  });
})();
