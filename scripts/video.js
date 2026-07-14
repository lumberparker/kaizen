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

// When the blue CTA reaches the sticky marquee, translate the marquee up
// in lockstep with the CTA top edge so it is pushed off rather than covered.
(function () {
  const pin = document.querySelector(".video-pin");
  const marquee = pin && pin.querySelector(".marquee");
  const cta = document.querySelector(".cta");
  if (!pin || !marquee || !cta) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const pinTop = pin.getBoundingClientRect().top;
    const marqueeHeight = marquee.offsetHeight;
    // Natural bottom of the marquee while it sits at the top of the pin
    // (ignores any prior translateY so measurement stays stable).
    const naturalBottom = pinTop + marqueeHeight;
    const ctaTop = cta.getBoundingClientRect().top;
    const overlap = naturalBottom - ctaTop;

    if (overlap > 0) {
      marquee.style.transform = "translateY(" + -overlap + "px)";
    } else {
      marquee.style.transform = "";
    }
  };

  const onScrollOrResize = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  update();
})();
