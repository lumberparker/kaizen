// Ensure muted autoplay starts reliably across browsers.
(function () {
  const video = document.querySelector(".video__player");
  if (!video) return;

  video.muted = true;
  const play = () => {
    video.play().catch(() => {
      // Autoplay may be blocked until a user gesture; poster stays visible.
    });
  };

  if (video.readyState >= 2) {
    play();
  } else {
    video.addEventListener("canplay", play, { once: true });
  }
})();
