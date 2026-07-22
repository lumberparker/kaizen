// Proyectos gallery: on every page load, fill the project slots with a
// random selection of Hexaparks renders — never repeating an image within
// the same page (shuffle, then take one per slot).
(function () {
  const POOL = [
    "hexa-1",
    "hexa-2",
    "hexa-3",
    "hexa-4",
    "hexa-5",
    "hexa-6",
    "hexa-7",
    "hexa-8",
    "hexa-9",
  ];

  const slots = document.querySelectorAll(".proyectos__image[data-proyecto-random]");
  if (!slots.length) return;

  // Fisher–Yates shuffle so the order is uniformly random each load.
  const bag = POOL.slice();
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }

  // One distinct render per slot (bag length ≥ slot count, so no repeats).
  slots.forEach((img, i) => {
    const name = bag[i % bag.length];
    img.src = `./assets/images/proyectos/${name}.webp`;
  });
})();
