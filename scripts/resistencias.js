// Interactive strength scale: the knob travels along the bar when a
// resistance is selected, and auto-animates once when scrolled into view.
(function () {
  const section = document.querySelector(".resistencias");
  if (!section) return;

  const scale = section.querySelector(".resistencias__scale");
  const items = Array.from(
    section.querySelectorAll(".resistencias__item")
  );

  // Knob stops aligned with the five columns (percent of the bar width).
  const stops = [4, 27, 50, 73, 96];

  const select = (index) => {
    scale.style.setProperty("--knob-position", `${stops[index]}%`);
    items.forEach((item, i) =>
      item.classList.toggle("resistencias__item_active", i === index)
    );
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => select(index));
    item.addEventListener("mouseenter", () => select(index));
  });

  // Sweep across the scale the first time the section becomes visible.
  let played = false;
  const observer = new IntersectionObserver(
    (entries) => {
      if (played || !entries.some((entry) => entry.isIntersecting)) return;
      played = true;
      observer.disconnect();
      items.forEach((_, i) => setTimeout(() => select(i), 500 * i));
      setTimeout(() => select(0), 500 * items.length);
    },
    { threshold: 0.4 }
  );
  observer.observe(section);
})();
