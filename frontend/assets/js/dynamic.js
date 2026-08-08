/* ============================================================
   Pradeep Timber Enterprises — Dynamic Content (Backend API)
   Loads blogs / gallery / FAQ from MongoDB backend and injects
   into the existing markup structure. Runs after main.js.
   ============================================================ */
(function () {
  const API_BASE = "https://www.api.theplycompany.com"; // same-origin; set to full backend URL if hosted separately

  function esc(str) {
    return (str || "").toString().replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function fmtDate(d) {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function revealize(el) {
    el.classList.add("reveal-up");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      io.observe(el);
    } else {
      el.classList.add("is-visible");
    }
  }

  /* ---------- FAQ (index.html) ---------- */
  function bindFaqAccordion(scope) {
    scope.querySelectorAll(".faq-item").forEach((item) => {
      const btn = item.querySelector(".faq-question");
      const panel = item.querySelector(".faq-answer");
      if (!btn || !panel || btn.dataset.bound) return;
      btn.dataset.bound = "1";
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
  }

  async function loadFaqs() {
    const container = document.getElementById("faq-list-container");
    if (!container) return;
    try {
      const res = await fetch(API_BASE + "/api/faqs");
      const faqs = await res.json();
      if (!Array.isArray(faqs) || !faqs.length) return; // keep static fallback if API empty/unreachable

      container.innerHTML = faqs.map((f) => `
        <div class="faq-item">
          <button class="faq-question">
            <span>${esc(f.question)}</span><span class="faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>
          </button>
          <div class="faq-answer"><div class="faq-answer-inner">${esc(f.answer)}</div></div>
        </div>
      `).join("");
      bindFaqAccordion(container);
    } catch (e) {
      console.warn("FAQ load failed, keeping static content", e);
    }
  }

  /* ---------- Blog (blog.html) ---------- */
  async function loadBlogs() {
    const featuredEl = document.getElementById("featured-blog-container");
    const gridEl = document.getElementById("blog-grid-container");
    if (!featuredEl && !gridEl) return;
    try {
      const res = await fetch(API_BASE + "/api/blogs");
      const blogs = await res.json();
      if (!Array.isArray(blogs) || !blogs.length) return;

      const featured = blogs.find((b) => b.featured) || blogs[0];
      const rest = blogs.filter((b) => b._id !== featured._id);

      if (featuredEl && featured) {
        featuredEl.innerHTML = `
          <img src="https://www.api.theplycompany.com${featured.image}" alt="Featured guide: ${esc(featured.title)}" class="w-full h-64 lg:h-full object-cover" loading="lazy" />
          <div class="p-8 sm:p-10 flex flex-col justify-center">
            <div class="flex items-center gap-3 text-xs text-stone-500"><span class="text-green font-semibold">${esc(featured.category)}</span><span>&middot;</span><span>${fmtDate(featured.date)}</span><span>&middot;</span><span>${esc(featured.readTime)}</span></div>
            <h2 class="font-display font-bold text-2xl sm:text-3xl mt-3 text-[#241811]">${esc(featured.title)}</h2>
            <p class="text-stone-600 mt-3 leading-relaxed">${esc(featured.excerpt)}</p>
            <a href="blog-detail.html?slug=${encodeURIComponent(featured.slug)}" class="inline-flex items-center gap-2 mt-5 font-semibold text-brown w-fit">Read More <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></a>
          </div>
        `;
      }

      if (gridEl) {
        gridEl.innerHTML = rest.map((b) => `
          <article class="card overflow-hidden group">
            <img src="https://www.api.theplycompany.com${b.image}" alt="${esc(b.title)}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            <div class="p-6">
              <div class="flex items-center gap-3 text-xs text-stone-500"><span class="text-green font-semibold">${esc(b.category)}</span><span>&middot;</span><span>${fmtDate(b.date)}</span></div>
              <h3 class="font-display font-semibold text-lg mt-3"><a href="blog-detail.html?slug=${encodeURIComponent(b.slug)}">${esc(b.title)}</a></h3>
              <p class="text-sm text-stone-500 mt-2">${esc(b.excerpt)}</p>
            </div>
          </article>
        `).join("");
        gridEl.querySelectorAll(".card").forEach(revealize);
      }
    } catch (e) {
      console.warn("Blog load failed, keeping static content", e);
    }
  }

  /* ---------- Gallery (gallery.html) ---------- */
  function bindGalleryInteractions() {
    const filterBtns = document.querySelectorAll(".gallery-filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");
    filterBtns.forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("gallery-filter-btn--active"));
        btn.classList.add("gallery-filter-btn--active");
        const filter = btn.getAttribute("data-filter");
        document.querySelectorAll(".gallery-item").forEach((item) => {
          const match = filter === "all" || item.getAttribute("data-category") === filter;
          item.style.display = match ? "" : "none";
        });
      });
    });

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    document.querySelectorAll(".gallery-item img").forEach((img) => {
      if (img.dataset.bound) return;
      img.dataset.bound = "1";
      img.addEventListener("click", () => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("lightbox--open");
        document.body.classList.add("overflow-hidden");
      });
    });
  }

  async function loadGallery() {
    const container = document.getElementById("gallery-container");
    if (!container) return;
    try {
      const res = await fetch(API_BASE + "/api/gallery");
      const items = await res.json();
      if (!Array.isArray(items) || !items.length) return;

      container.innerHTML = items.map((g) => `
        <div class="gallery-item mb-5 break-inside-avoid" data-category="${esc(g.category)}">
          <img src="https://www.api.theplycompany.com${g.image}" alt="${esc(g.title)}" loading="lazy" />
          <div class="gallery-overlay"><p class="text-white text-sm font-medium">${esc(g.title)}</p></div>
        </div>
      `).join("");
      container.querySelectorAll(".gallery-item").forEach(revealize);
      bindGalleryInteractions();
    } catch (e) {
      console.warn("Gallery load failed, keeping static content", e);
    }
  }

  /* ---------- Contact form -> save inquiry to backend ---------- */
  function bindInquirySave() {
    const form = document.querySelector('[data-demo-form]');
    if (!form) return;
    // Runs in capture phase BEFORE contact.html's own WhatsApp handler,
    // so it never blocks or alters that existing behaviour.
    form.addEventListener("submit", function () {
      try {
        const fd = new FormData(form);
        const payload = new FormData();
        payload.set("name", fd.get("name") || "");
        payload.set("phone", fd.get("phone") || "");
        payload.set("email", fd.get("email") || "");
        payload.set("product", fd.get("product") || "");
        payload.set("message", fd.get("message") || "");
        const file = fd.get("attachment");
        if (file && file.size) payload.set("attachment", file);

        fetch(API_BASE + "/api/inquiries", { method: "POST", body: payload }).catch((e) =>
          console.warn("Inquiry save failed", e)
        );
      } catch (e) {
        console.warn("Inquiry save skipped", e);
      }
    }, true); // capture: fires before contact.html's own listener, never preventDefault so nothing changes
  }

  // Runs immediately (not on DOMContentLoaded): this script tag sits after
  // the page content, so target elements already exist. Crucially, this
  // must register the inquiry-save listener BEFORE contact.html's own
  // inline WhatsApp script (which calls stopImmediatePropagation) does —
  // that inline script runs later in the file, so registering now keeps
  // both listeners firing correctly, in order.
  loadFaqs();
  loadBlogs();
  loadGallery();
  bindInquirySave();
})();
