// Mobile menu toggle. The active nav link is set per page in the markup,
// since this is a multi-page site (Inicio, Nosotros, Productos, Contacto).
(function () {
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".nav__burger");
  if (!nav || !burger) return;

  const links = Array.from(document.querySelectorAll(".nav__link"));

  burger.addEventListener("click", () => {
    const opened = nav.classList.toggle("nav_opened");
    burger.setAttribute("aria-expanded", String(opened));
    burger.setAttribute("aria-label", opened ? "Cerrar menú" : "Abrir menú");
  });

  links.forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("nav_opened");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Abrir menú");
    })
  );
})();
