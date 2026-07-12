// Hides the intro loader once the page (fonts, images) has finished loading.
(function () {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const hide = () => loader.classList.add("loader_hidden");

  if (document.readyState === "complete") {
    hide();
  } else {
    window.addEventListener("load", hide);
    // Safety net so the loader never traps the page.
    setTimeout(hide, 4000);
  }
})();
