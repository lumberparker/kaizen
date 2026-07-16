// Interactive strength scale: the knob travels along the bar when a
// resistance is selected, can be dragged with the pointer, and
// auto-animates once when scrolled into view.
(function () {
  const section = document.querySelector(".resistencias");
  if (!section) return;

  const scale = section.querySelector(".resistencias__scale");
  const items = Array.from(section.querySelectorAll(".resistencias__item"));

  // Knob stops aligned with the five columns (percent of the bar width).
  const stops = [4, 27, 50, 73, 96];

  const highlight = (index) => {
    items.forEach((item, i) =>
      item.classList.toggle("resistencias__item_active", i === index)
    );
  };

  const nearestStop = (percent) => {
    let best = 0;
    stops.forEach((stop, i) => {
      if (Math.abs(stop - percent) < Math.abs(stops[best] - percent)) best = i;
    });
    return best;
  };

  const select = (index) => {
    scale.style.setProperty("--knob-position", `${stops[index]}%`);
    highlight(index);
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => select(index));
    item.addEventListener("mouseenter", () => select(index));
  });

  // Drag: the knob follows the pointer and snaps to the nearest stop on
  // release. Pressing anywhere on the bar jumps the knob there too.
  let dragging = false;

  const percentFromEvent = (event) => {
    const rect = scale.getBoundingClientRect();
    const percent = ((event.clientX - rect.left) / rect.width) * 100;
    return Math.min(stops[stops.length - 1], Math.max(stops[0], percent));
  };

  scale.addEventListener("pointerdown", (event) => {
    dragging = true;
    scale.classList.add("resistencias__scale_dragging");
    scale.setPointerCapture(event.pointerId);
    const percent = percentFromEvent(event);
    scale.style.setProperty("--knob-position", `${percent}%`);
    highlight(nearestStop(percent));
  });

  scale.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const percent = percentFromEvent(event);
    scale.style.setProperty("--knob-position", `${percent}%`);
    highlight(nearestStop(percent));
  });

  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    scale.classList.remove("resistencias__scale_dragging");
    select(nearestStop(percentFromEvent(event)));
  };

  scale.addEventListener("pointerup", endDrag);
  scale.addEventListener("pointercancel", endDrag);

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
