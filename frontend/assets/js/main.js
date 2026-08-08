/* ============================================================
   Pradeep Timber Enterprises — Core Interactions
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Inject header & footer ---------- */
  const headerMount = document.getElementById("site-header-mount");
  const footerMount = document.getElementById("site-footer-mount");
  if (headerMount && window.__PLY_HEADER__) headerMount.innerHTML = window.__PLY_HEADER__;
  if (footerMount && window.__PLY_FOOTER__) footerMount.innerHTML = window.__PLY_FOOTER__;

  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Active nav link ---------- */
  const page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".nav-link[data-page]").forEach((link) => {
      if (link.getAttribute("data-page") === page) link.classList.add("nav-link--active");
    });
  }

  /* ---------- Sticky header shrink ---------- */
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("header--scrolled");
    else header.classList.remove("header--scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("mobile-menu--open");
      menuBtn.classList.toggle("burger--open", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("overflow-hidden", isOpen);
    });
  }
  const mobileServicesToggle = document.getElementById("mobile-services-toggle");
  const mobileServicesPanel = document.getElementById("mobile-services-panel");
  const mobileServicesChevron = document.getElementById("mobile-services-chevron");
  if (mobileServicesToggle && mobileServicesPanel) {
    mobileServicesToggle.addEventListener("click", () => {
      mobileServicesPanel.classList.toggle("hidden");
      mobileServicesChevron.classList.toggle("rotate-180");
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-answer");
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("faq-item--open");
      document.querySelectorAll(".faq-item--open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("faq-item--open");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });
      item.classList.toggle("faq-item--open", !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
    });
  });

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("gallery-filter-btn--active"));
      btn.classList.add("gallery-filter-btn--active");
      const filter = btn.getAttribute("data-filter");
      galleryItems.forEach((item) => {
        const match = filter === "all" || item.getAttribute("data-category") === filter;
        item.style.display = match ? "" : "none";
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.addEventListener("click", () => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) lightboxCaption.textContent = img.alt;
      lightbox.classList.add("lightbox--open");
      document.body.classList.add("overflow-hidden");
    });
  });
  const lightboxClose = document.getElementById("lightbox-close");
  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("lightbox--open");
      document.body.classList.remove("overflow-hidden");
    });
  }
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("lightbox--open");
        document.body.classList.remove("overflow-hidden");
      }
    });
  }

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById("testimonial-track");
  if (track) {
    const slides = track.children.length;
    let index = 0;
    const dotsWrap = document.getElementById("testimonial-dots");
    const goTo = (i) => {
      index = (i + slides) % slides;
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dotsWrap) {
        [...dotsWrap.children].forEach((d, di) => d.classList.toggle("testi-dot--active", di === index));
      }
    };
    if (dotsWrap) {
      for (let i = 0; i < slides; i++) {
        const dot = document.createElement("button");
        dot.className = "testi-dot" + (i === 0 ? " testi-dot--active" : "");
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }
    document.getElementById("testi-next")?.addEventListener("click", () => goTo(index + 1));
    document.getElementById("testi-prev")?.addEventListener("click", () => goTo(index - 1));
    let auto = setInterval(() => goTo(index + 1), 6000);
    track.closest(".testi-wrap")?.addEventListener("mouseenter", () => clearInterval(auto));
    track.closest(".testi-wrap")?.addEventListener("mouseleave", () => (auto = setInterval(() => goTo(index + 1), 6000)));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-fade");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".counter");
  if (counters.length && "IntersectionObserver" in window) {
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target"), 10) || 0;
          const duration = 1600;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString();
          };
          requestAnimationFrame(step);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => counterIO.observe(c));
  }

  /* ---------- Contact / quote forms (no backend — demo only) ---------- */
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const toast = document.getElementById("form-toast");
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Sending...";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          form.reset();
          if (toast) {
            toast.classList.add("form-toast--show");
            setTimeout(() => toast.classList.remove("form-toast--show"), 4000);
          }
        }, 900);
      }
    });
  });

  /* ---------- Newsletter form ---------- */
  document.querySelectorAll("form[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Subscribed \u2713";
        setTimeout(() => (btn.textContent = original), 2500);
      }
      form.reset();
    });
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("back-to-top--show", window.scrollY > 600);
      },
      { passive: true }
    );
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
});
