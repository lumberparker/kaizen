// Interactive strength scale: the knob travels along the bar when a
// resistance is selected, can be dragged with the pointer, and
// auto-animates once when scrolled into view.
(function () {
  const section = document.querySelector(".resistencias");
  if (!section) return;

  const scale = section.querySelector(".resistencias__scale");
  // The "Y más" cell is a link to contact, not a stop on the scale.
  const items = Array.from(
    section.querySelectorAll(
      ".resistencias__item:not(.resistencias__item_type_more)"
    )
  );
  if (!scale || !items.length) return;

  // On mobile the bar is rotated: it runs vertically beside the list, so
  // positions are measured along Y instead of X.
  const isVertical = () => window.matchMedia("(max-width: 720px)").matches;

  // Stops are derived from each item's real centre, so the knob stays
  // aligned however the current breakpoint lays the list out.
  let stops = [];
  const measureStops = () => {
    const scaleRect = scale.getBoundingClientRect();
    const vertical = isVertical();
    const size = vertical ? scaleRect.height : scaleRect.width;
    if (!size) return;
    stops = items.map((item) => {
      const rect = item.getBoundingClientRect();
      const centre = vertical
        ? rect.top + rect.height / 2 - scaleRect.top
        : rect.left + rect.width / 2 - scaleRect.left;
      return Math.min(100, Math.max(0, (centre / size) * 100));
    });
  };

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

  let currentIndex = 0;

  const select = (index) => {
    if (!stops.length) measureStops();
    currentIndex = index;
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
    const percent = isVertical()
      ? ((event.clientY - rect.top) / rect.height) * 100
      : ((event.clientX - rect.left) / rect.width) * 100;
    const min = stops[0];
    const max = stops[stops.length - 1];
    return Math.min(max, Math.max(min, percent));
  };

  scale.addEventListener("pointerdown", (event) => {
    measureStops();
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

  // Hovering "Y más" fills the whole bar — the range keeps going beyond
  // the listed strengths. Leaving restores the selected resistance.
  const more = section.querySelector(".resistencias__more");
  if (more) {
    more.addEventListener("mouseenter", () => {
      if (dragging) return;
      scale.style.setProperty("--knob-position", "100%");
      highlight(-1);
    });
    more.addEventListener("mouseleave", () => {
      if (dragging) return;
      select(currentIndex);
    });
  }

  // Keep the knob on its column when the layout reflows.
  let activeIndex = 0;
  const rememberActive = () => {
    const found = items.findIndex((item) =>
      item.classList.contains("resistencias__item_active")
    );
    activeIndex = found === -1 ? 0 : found;
  };
  window.addEventListener("resize", () => {
    rememberActive();
    measureStops();
    select(activeIndex);
  });

  measureStops();

  // Sweep across the scale the first time the section becomes visible.
  let played = false;
  const observer = new IntersectionObserver(
    (entries) => {
      if (played || !entries.some((entry) => entry.isIntersecting)) return;
      played = true;
      observer.disconnect();
      measureStops();
      items.forEach((_, i) => setTimeout(() => select(i), 500 * i));
      setTimeout(() => select(0), 500 * items.length);
    },
    { threshold: 0.4 }
  );
  observer.observe(section);
})();
