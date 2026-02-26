// Replace this with your deployed Google Apps Script web app URL
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxhVq3jfIOy2YqRKZCePtsN1P0wv7rKlvnoGWzXv8Z-0IIq9dPkBTyyAUf-8PFcsaSTfA/exec";

function setupRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (typeof IntersectionObserver !== "function") {
    elements.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    elements.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  elements.forEach((element) => observer.observe(element));
}

function setupRsvpForm() {
  const form = document.getElementById("rsvp-form");
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const data = new FormData(form);
    const payload = {
      fullName: data.get("fullName"),
      email: data.get("email"),
      market: data.get("market"),
      attendance: data.get("attendance"),
      message: data.get("message") || "",
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Disable all fields
      for (const el of form.elements) el.disabled = true;
      submitBtn.textContent = "Submitted!";

      // Show toast immediately with spinner
      const toast = showToast("Counting signups\u2026", false, true);

      // Skeleton on teaser text
      const teaser = document.getElementById("rsvp-teaser-text");
      if (teaser) teaser.classList.add("skeleton");

      // Unblur avatar photos
      const avatars = document.querySelectorAll("#avatar-stack img");
      avatars.forEach((img) => (img.style.filter = "none"));

      // Fetch attendee count and update toast + teaser
      try {
        const res = await fetch(APPS_SCRIPT_URL);
        const counts = await res.json();
        const total = counts.yes + counts.maybe;

        if (teaser) {
          teaser.classList.remove("skeleton");
          teaser.textContent = `${total} people signed up so far.`;
        }
        updateToast(toast, `You're on the list! ${total} people signed up so far.`);
      } catch (_) {
        if (teaser) teaser.classList.remove("skeleton");
        updateToast(toast, "You're on the list! See you March 5th.");
      }
    } catch (err) {
      console.error("RSVP submission failed:", err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      showToast("Something went wrong. Try again or RSVP via WhatsApp.", true);
    }
  });
}

function showToast(message, isError = false, loading = false) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast" + (isError ? " toast-error" : "");
  if (loading) toast.classList.add("toast-loading");
  toast.innerHTML = loading
    ? `<span class="toast-spinner"></span><span>${message}</span>`
    : message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast-visible"));

  if (!loading) {
    setTimeout(() => {
      toast.classList.remove("toast-visible");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 5000);
  }

  return toast;
}

function updateToast(toast, message) {
  if (!toast || !toast.parentNode) return;
  toast.classList.remove("toast-loading");
  toast.innerHTML = message;

  setTimeout(() => {
    toast.classList.remove("toast-visible");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 5000);
}

setupRevealAnimations();
setupRsvpForm();
