const RSVP_EMAIL = "alumni-rsvp@otovo.com";

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
  const success = document.getElementById("rsvp-success");
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const fullName = String(data.get("fullName") ?? "");
    const email = String(data.get("email") ?? "");
    const market = String(data.get("market") ?? "");
    const attendance = String(data.get("attendance") ?? "");
    const plusOnes = String(data.get("plusOnes") ?? "0");
    const dietary = String(data.get("dietary") ?? "None");
    const message = String(data.get("message") ?? "");

    const subject = encodeURIComponent(
      `RSVP - Otovo Special Event - ${fullName || "New attendee"}`,
    );

    const body = encodeURIComponent(
      [
        "Hi,",
        "",
        "I am RSVPing for the Otovo Special Event in Oslo (March 5, 2026).",
        "",
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Market: ${market}`,
        `Attendance: ${attendance}`,
        `Plus-ones: ${plusOnes}`,
        `Dietary notes: ${dietary || "None"}`,
        `Extra message: ${message || "None"}`,
      ].join("\n"),
    );

    window.location.href =
      `mailto:${RSVP_EMAIL}?subject=${subject}&body=${body}`;
    if (success) success.hidden = false;
  });
}

setupRevealAnimations();
setupRsvpForm();
