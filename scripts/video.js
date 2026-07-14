// Lazy-load the showcase video when it nears the viewport, then keep
// muted autoplay running reliably (poster should not stick around).
(function () {
  const video = document.querySelector(".video__player");
  if (!video) return;

  const source = video.getAttribute("data-src");
  if (!source) return;

  const pin = document.querySelector(".video-pin");
  const observeTarget = pin || video;
  let loadStarted = false;

  const ensurePlaybackAttrs = () => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  };

  // Drop the poster once a decoded frame exists so a failed/late autoplay
  // still shows video content instead of the static image.
  const clearPoster = () => {
    if (video.getAttribute("poster")) {
      video.removeAttribute("poster");
    }
  };

  const startPlayback = () => {
    ensurePlaybackAttrs();

    if (video.readyState < 2) return;

    if (video.ended) {
      try {
        video.currentTime = 0;
      } catch (_) {
        /* ignore seek errors while not ready */
      }
    }

    if (!video.paused && !video.ended) {
      clearPoster();
      return;
    }

    const attempt = video.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(clearPoster).catch(() => {
        // Autoplay can be blocked until a gesture; listeners below retry.
      });
    }
  };

  const isTargetInView = () => {
    const rect = observeTarget.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    return rect.bottom > 0 && rect.top < vh;
  };

  const onLoadedData = () => {
    clearPoster();
    startPlayback();
  };

  const onPause = () => {
    // iOS / low-power mode often pauses background media; resume if visible.
    if (document.hidden || !isTargetInView()) return;
    startPlayback();
  };

  const bindMediaListeners = () => {
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", startPlayback);
    video.addEventListener("playing", clearPoster);
    video.addEventListener("pause", onPause);
    video.addEventListener("stalled", startPlayback);
  };

  const loadAndPlay = () => {
    ensurePlaybackAttrs();

    if (!loadStarted) {
      loadStarted = true;
      // Register before assigning src so a cached response cannot race past us.
      bindMediaListeners();
      video.preload = "auto";
      video.src = source;
      video.load();
    }

    startPlayback();
  };

  if ("IntersectionObserver" in window) {
    // Start downloading early so the poster is gone by the time it pins.
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadObserver.disconnect();
        loadAndPlay();
      },
      { rootMargin: "50% 0px" }
    );
    loadObserver.observe(observeTarget);

    // While the pin is on screen, keep trying to play (covers autoplay blocks
    // that resolve after a gesture, and pause-from-background cases).
    const playObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        if (loadStarted) startPlayback();
        else loadAndPlay();
      },
      { threshold: 0.05 }
    );
    playObserver.observe(observeTarget);
  } else {
    loadAndPlay();
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && loadStarted) startPlayback();
  });

  window.addEventListener("pageshow", () => {
    if (loadStarted) startPlayback();
  });

  // Fallback: first user gesture unlocks autoplay policies that blocked play().
  const onGesture = () => {
    if (loadStarted) startPlayback();
    else loadAndPlay();
  };
  ["pointerdown", "touchstart", "keydown"].forEach((type) => {
    window.addEventListener(type, onGesture, { passive: true, once: true });
  });
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
