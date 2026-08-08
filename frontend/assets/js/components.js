/* ============================================================
   Pradeep Timber Enterprises — Shared Header & Footer
   BASE_PATH must be defined before this script runs:
   "" for root pages, "../" for pages inside /services/
   ============================================================ */

(function () {
  const B = typeof BASE_PATH !== "undefined" ? BASE_PATH : "";

  const services = [
    { slug: "premium-plywood", name: "Plywood & Flexi Ply" },
    { slug: "decorative-laminates", name: "Mica & Laminates" },
    { slug: "mdf-boards", name: "HDHMR & MDF Boards" },
    { slug: "block-boards", name: "PVC Boards" },
    { slug: "flush-doors", name: "Door Installation" },
    { slug: "veneers", name: "Wood Varieties" },
    { slug: "hardware-accessories", name: "Adhesives & Hardware" },
    { slug: "interior-wood-solutions", name: "Carpentry Services" },
    { slug: "custom-timber-solutions", name: "Shuttering Ply" },
  ];

  const serviceLinks = services
    .map(
      (s) => `
      <a href="${B}services/${s.slug}.html" class="ring-link">
        <span class="ring-dot"></span>${s.name}
      </a>`
    )
    .join("");

  const mobileServiceLinks = services
    .map(
      (s) => `<a href="${B}services/${s.slug}.html" class="block py-2 pl-4 text-[15px] text-stone-600 hover:text-[#6B4226]">${s.name}</a>`
    )
    .join("");

  const HEADER = `
  <header id="site-header" class="fixed top-0 inset-x-0 z-50 transition-all duration-300">
    <div class="header-inner mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between h-20 transition-all duration-300">
      <a href="${B}index.html" class="flex items-center gap-2.5 shrink-0">
        <img src="${B}assets/img/logo2-bg-remove.png" alt="Pradeep Timber Enterprises" class="h-16 w-auto object-contain" />
        
      </a>

      <nav class="hidden lg:flex items-center gap-9 font-medium text-[15px] text-stone-700" aria-label="Primary">
        <a href="${B}index.html" class="nav-link" data-page="home">Home</a>
        <a href="${B}about.html" class="nav-link" data-page="about">About</a>
        <div class="relative group">
          <button class="nav-link flex items-center gap-1.5" data-page="services">
            Services
            <svg width="11" height="7" viewBox="0 0 11 7" class="mt-0.5 transition-transform duration-300 group-hover:rotate-180"><path d="M1 1l4.5 4.5L10 1" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>
          </button>
          <div class="dropdown-panel">
            <a href="${B}services/index.html" class="ring-link ring-link--all">
              <span class="ring-dot"></span>All Services
            </a>
            <div class="dropdown-divider"></div>
            ${serviceLinks}
          </div>
        </div>
        <a href="${B}gallery.html" class="nav-link" data-page="gallery">Gallery</a>
        <a href="${B}blog.html" class="nav-link" data-page="blog">Blog</a>
        <a href="${B}contact.html" class="nav-link" data-page="contact">Contact</a>
      </nav>

      <div class="hidden lg:flex items-center gap-3">
        <a href="tel:+919315033801" class="header-call-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.2-.3c1.3.4 2.7.6 4.1.6.7 0 1.3.6 1.3 1.3V21c0 .7-.6 1.3-1.3 1.3C10.7 22.3 1.7 13.3 1.7 3.3 1.7 2.6 2.3 2 3 2h4.2c.7 0 1.3.6 1.3 1.3 0 1.4.2 2.8.6 4.1.1.4 0 .9-.3 1.2L6.6 10.8Z" stroke="currentColor" stroke-width="1.5"/></svg>
          <span>+91 93150 33801</span>
        </a>
        <a href="https://wa.me/919315033801" target="_blank" rel="noopener" class="header-wa-btn" aria-label="Chat on WhatsApp">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1a12.6 12.6 0 0 0 6.3 1.7c7 0 12.7-5.7 12.7-12.7C28.7 8.7 23 3 16 3Zm0 23.1c-2 0-3.9-.5-5.5-1.5l-.4-.2-4 1.2 1.2-3.9-.3-.4a10.4 10.4 0 1 1 9 4.8Zm5.7-7.7c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.1-.3.2-.6 0a8.3 8.3 0 0 1-4.1-3.6c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg>
        </a>
      </div>

      <button id="mobile-menu-btn" class="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]" aria-label="Toggle menu" aria-expanded="false">
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
      </button>
    </div>

    <div id="mobile-menu" class="mobile-menu">
      <nav class="flex flex-col px-6 py-6 gap-1" aria-label="Mobile">
        <a href="${B}index.html" class="mobile-link">Home</a>
        <a href="${B}about.html" class="mobile-link">About</a>
        <button id="mobile-services-toggle" class="mobile-link flex items-center justify-between w-full">
          Services
          <svg width="11" height="7" viewBox="0 0 11 7" id="mobile-services-chevron" class="transition-transform duration-300"><path d="M1 1l4.5 4.5L10 1" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>
        </button>
        <div id="mobile-services-panel" class="hidden">
          <a href="${B}services/index.html" class="block py-2 pl-4 text-[15px] font-medium text-[#6B4226]">All Services</a>
          ${mobileServiceLinks}
        </div>
        <a href="${B}gallery.html" class="mobile-link">Gallery</a>
        <a href="${B}blog.html" class="mobile-link">Blog</a>
        <a href="${B}contact.html" class="mobile-link">Contact</a>
        <div class="flex gap-3 mt-4">
          <a href="tel:+919315033801" class="header-call-btn flex-1 justify-center">Call Us</a>
          <a href="https://wa.me/919315033801" target="_blank" rel="noopener" class="header-wa-btn !w-auto flex-1 justify-center px-4">WhatsApp</a>
        </div>
      </nav>
    </div>
  </header>`;

  const FOOTER = `
  <footer class="bg-[#241811] text-[#EFE6DA] pt-20 pb-8 relative overflow-hidden">
    <div class="absolute -right-24 -top-24 opacity-[0.06] pointer-events-none" aria-hidden="true">
      <svg width="420" height="420" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="none" stroke="#D4A373" stroke-width="0.6"/><circle cx="22" cy="22" r="14.5" fill="none" stroke="#D4A373" stroke-width="0.6"/><circle cx="22" cy="22" r="9" fill="none" stroke="#D4A373" stroke-width="0.6"/></svg>
    </div>
    <div class="mx-auto max-w-7xl px-5 lg:px-8 relative">
      <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14 border-b border-white/10">
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2.5 mb-5">
            <img src="${B}assets/img/logo2.png" alt="Pradeep Timber Enterprises" class="h-20 w-auto object-contain" />
          </div>
          <p class="text-[15px] leading-relaxed text-[#c9bcac] max-w-sm">Your one-stop solution for every plywood need &mdash; plywood, PVC boards, HDHMR, MDF, mica, adhesives, hardware and premium timber varieties, backed by expert carpentry and installation services.</p>
          
        </div>

        <div>
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="space-y-2.5 text-[15px] text-[#c9bcac]">
            <li><a href="${B}index.html" class="footer-link">Home</a></li>
            <li><a href="${B}about.html" class="footer-link">About Us</a></li>
            <li><a href="${B}gallery.html" class="footer-link">Gallery</a></li>
            <li><a href="${B}blog.html" class="footer-link">Blog</a></li>
            <li><a href="${B}contact.html" class="footer-link">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-heading">Services</h4>
          <ul class="space-y-2.5 text-[15px] text-[#c9bcac]">
            <li><a href="${B}services/premium-plywood.html" class="footer-link">Plywood & Flexi Ply</a></li>
            <li><a href="${B}services/decorative-laminates.html" class="footer-link">Mica & Laminates</a></li>
            <li><a href="${B}services/mdf-boards.html" class="footer-link">HDHMR & MDF Boards</a></li>
            <li><a href="${B}services/block-boards.html" class="footer-link">PVC Boards</a></li>
            <li><a href="${B}services/hardware-accessories.html" class="footer-link">Adhesives & Hardware</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-heading">Get In Touch</h4>
          <ul class="space-y-3 text-[15px] text-[#c9bcac]">
            <li class="flex gap-2.5"><span class="mt-0.5 text-[#D4A373]">&#128205;</span>22 D, Kewal Park Extension, Gopal Nagar, Azadpur, Delhi, 110033</li>
            <li class="flex gap-2.5"><span class="text-[#D4A373]">&#128222;</span><a href="tel:+919315033801" class="footer-link">+91 93150 33801 (Ankit)</a></li>
            <li class="flex gap-2.5"><span class="text-[#D4A373]">&#128222;</span><a href="tel:+919312220052" class="footer-link">+91 93122 20052 (Pradeep)</a></li>
            <li class="flex gap-2.5"><span class="text-[#D4A373]">&#9993;</span><a href="mailto:ankit27agg@gmail.com" class="footer-link">ankit27agg@gmail.com</a></li>
            <li class="flex gap-2.5"><span class="text-[#D4A373]">&#128337;</span>Mon &ndash; Sun: 9:15 AM &ndash; 7:30 PM</li>
          </ul>
        </div>
      </div>

      <div class="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-[#9c8b78]">
        <p>&copy; <span id="footer-year"></span> Pradeep Timber Enterprises. All rights reserved.</p>
        <p>Crafted with grain-deep care for timber that lasts generations.</p>
      </div>
    </div>
  </footer>

  <a href="https://wa.me/919315033801" target="_blank" rel="noopener" class="whatsapp-float" aria-label="Chat with us on WhatsApp">
    <svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.5.7 4.8 1.9 6.8L3 29l6.7-2.1a12.6 12.6 0 0 0 6.3 1.7c7 0 12.7-5.7 12.7-12.7C28.7 8.7 23 3 16 3Zm0 23.1c-2 0-3.9-.5-5.5-1.5l-.4-.2-4 1.2 1.2-3.9-.3-.4a10.4 10.4 0 1 1 9 4.8Z"/></svg>
  </a>`;

  window.__PLY_HEADER__ = HEADER;
  window.__PLY_FOOTER__ = FOOTER;
})();
