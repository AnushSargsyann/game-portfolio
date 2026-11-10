/* =========================================================
   Anush Sargsyan — Portfolio scripts
   1. Header background on scroll
   2. Mobile menu
   3. Active menu link
   4. Reveal on scroll + skill bars
   5. Hero pixel-particle background
   6. Game videos (one plays at a time) + missing-file placeholders
   7. Image lightbox
   8. Hide empty social links
   9. Footer year
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Header background on scroll ---------- */
  var header = document.querySelector(".header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- 3. Active menu link ---------- */
  var links = document.querySelectorAll('.nav a[href^="#"]');
  if ("IntersectionObserver" in window) {
    var linkObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        links.forEach(function (l) {
          l.classList.toggle("is-active", l.getAttribute("href") === id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    links.forEach(function (l) {
      var target = document.querySelector(l.getAttribute("href"));
      if (target) linkObserver.observe(target);
    });
  }

  /* ---------- 4. Reveal on scroll + skill bars ---------- */
  function fillSkill(el) {
    var bar = el.querySelector(".skill__bar i");
    var value = parseFloat(el.getAttribute("data-value")) || 0;
    if (bar) bar.style.width = Math.min(Math.max(value, 0), 100) + "%";
  }

  var reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
      if (el.classList.contains("skill")) fillSkill(el);
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-visible");
        if (el.classList.contains("skill")) fillSkill(el);
        obs.unobserve(el);
      });
    }, { threshold: 0.15 });

    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + "ms";
      revealObserver.observe(el);
    });
  }

  /* ---------- 5. Hero pixel-particle background ---------- */
  var canvas = document.querySelector(".hero__canvas");
  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var hero = canvas.parentElement;
    var W = 0, H = 0, dpr = 1;
    var pixels = [];
    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    var running = true;
    var colors = ["#d63dff", "#38f2d0", "#7a2cff", "#ecebf5"];

    function makePixel(randomY) {
      var size = [2, 3, 4, 6][Math.floor(Math.random() * 4)];
      return {
        x: Math.random() * W,
        y: randomY ? Math.random() * H : H + 10,
        s: size,
        v: 0.15 + Math.random() * 0.5,
        depth: 0.2 + Math.random() * 0.8,
        c: colors[Math.floor(Math.random() * colors.length)],
        a: 0.15 + Math.random() * 0.55,
        tw: Math.random() * Math.PI * 2
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth;
      H = hero.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(110, (W * H) / 14000));
      pixels = [];
      for (var i = 0; i < count; i++) pixels.push(makePixel(true));
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // smooth mouse parallax
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      for (var i = 0; i < pixels.length; i++) {
        var p = pixels[i];
        p.y -= p.v * p.depth;
        p.tw += 0.03;
        if (p.y < -10) pixels[i] = p = makePixel(false);

        var px = p.x + mouse.x * 30 * p.depth;
        var py = p.y + mouse.y * 20 * p.depth;
        ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(px), Math.round(py), p.s, p.s);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    window.addEventListener("pointermove", function (e) {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    // pause when hero is off screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) { running = true; requestAnimationFrame(draw); }
        if (!visible) running = false;
      }).observe(hero);
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    requestAnimationFrame(draw);
  }

  /* ---------- 6. Game videos + missing-file placeholders ---------- */
  function showMissing(el, path) {
    if (!el.parentNode || el.getAttribute("data-missing")) return;
    el.setAttribute("data-missing", "1");
    var box = document.createElement("div");
    box.className = "media-missing";
    box.innerHTML = "<b>File not uploaded yet</b><code></code>";
    box.querySelector("code").textContent = path;
    el.parentNode.replaceChild(box, el);
  }

  var videos = document.querySelectorAll("video.media");
  videos.forEach(function (video) {
    var source = video.querySelector("source");
    var path = source ? source.getAttribute("src") : video.getAttribute("src");

    // only one video plays at a time
    video.addEventListener("play", function () {
      videos.forEach(function (other) {
        if (other !== video && !other.paused) other.pause();
      });
    });

    if (source) source.addEventListener("error", function () { showMissing(video, path); });
    video.addEventListener("error", function () { showMissing(video, path); });
    // error may already have happened before this script ran
    if (video.networkState === 3) showMissing(video, path);
  });

  var images = document.querySelectorAll("img.media");
  images.forEach(function (img) {
    var path = img.getAttribute("src");
    img.addEventListener("error", function () { showMissing(img, path); });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("loading") !== "lazy") {
      showMissing(img, path);
    }
  });

  /* ---------- 7. Image lightbox ---------- */
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-label", "Image preview");
  lightbox.innerHTML = "<img alt=''>";
  document.body.appendChild(lightbox);
  var lightboxImg = lightbox.querySelector("img");

  document.addEventListener("click", function (e) {
    var img = e.target.closest && e.target.closest("img.media");
    if (img) {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("is-open");
    } else if (e.target.closest && e.target.closest(".lightbox")) {
      lightbox.classList.remove("is-open");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") lightbox.classList.remove("is-open");
  });

  /* ---------- 8. Hide social links that are still "#" ---------- */
  document.querySelectorAll(".socials a").forEach(function (a) {
    if (a.getAttribute("href") === "#") a.parentNode.style.display = "none";
  });
  var socials = document.querySelector(".socials");
  if (socials && !socials.querySelector('li:not([style*="none"])')) {
    socials.style.display = "none";
  }

  /* ---------- 9. Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
