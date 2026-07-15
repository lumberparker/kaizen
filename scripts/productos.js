// Accordion for the products & services section (one panel open at a time).
(function () {
  const items = Array.from(document.querySelectorAll(".productos__item"));
  if (!items.length) return;

  const setState = (item, opened) => {
    item.classList.toggle("productos__item_opened", opened);
    item
      .querySelector(".productos__header")
      .setAttribute("aria-expanded", String(opened));
  };

  items.forEach((item) => {
    const header = item.querySelector(".productos__header");
    header.addEventListener("click", () => {
      const willOpen = !item.classList.contains("productos__item_opened");
      items.forEach((other) => setState(other, false));
      setState(item, willOpen);
    });
  });

  // Initial state from markup — all panels start compressed (aria-expanded="false").
  items.forEach((item) => {
    const expanded =
      item.querySelector(".productos__header").getAttribute("aria-expanded") ===
      "true";
    setState(item, expanded);
  });
})();
