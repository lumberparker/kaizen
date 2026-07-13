// Lazy-load the showcase video when it nears the viewport, then ensure
// muted autoplay starts reliably across browsers.
(function () {
  const video = document.querySelector(".video__player");
  if (!video) return;

  const source = video.getAttribute("data-src");
  if (!source) return;

  const startPlayback = () => {
    video.muted = true;
    video.play().catch(() => {
      // Autoplay may be blocked until a user gesture; poster stays visible.
    });
  };

  const loadAndPlay = () => {
    if (video.src) return;
    video.src = source;
    video.load();
    if (video.readyState >= 2) {
      startPlayback();
    } else {
      video.addEventListener("canplay", startPlayback, { once: true });
    }
  };

  if (!("IntersectionObserver" in window)) {
    loadAndPlay();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadAndPlay();
    },
    { rootMargin: "200px 0px" }
  );

  observer.observe(video);
})();
