// Scroll-reveal: fades sections in as they enter the viewport.
(function () {
  const targets = document.querySelectorAll(
    [
      ".intro__title",
      ".intro__columns",
      ".cta__title",
      ".cta__mark",
      ".destaca__info",
      ".destaca__list",
      ".plantas__title",
      ".plantas__list",
      ".obra__content",
      ".pavimentos__info",
      ".pavimentos__figure",
      ".compromiso__text",
      ".encuentra__content",
      ".contacto__form",
    ].join(", ")
  );
  if (!targets.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal_visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((target) => {
    target.classList.add("reveal");
    observer.observe(target);
  });
})();
