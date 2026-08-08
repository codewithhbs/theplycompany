if (!Auth.getToken()) window.location.href = "index.html";

document.getElementById("logout-btn").addEventListener("click", () => {
  Auth.clear();
  window.location.href = "index.html";
});

/* ---------- Tabs ---------- */
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    tabPanels.forEach((p) => p.classList.add("hidden"));
    document.getElementById("tab-" + btn.dataset.tab).classList.remove("hidden");
    loadTab(btn.dataset.tab);
  });
});

/* ---------- Modal ---------- */
const modalOverlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");
document.getElementById("modal-close").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
function openModal(html) { modalBody.innerHTML = html; modalOverlay.classList.remove("hidden"); }
function closeModal() { modalOverlay.classList.add("hidden"); modalBody.innerHTML = ""; }

function esc(str) {
  return (str || "").toString().replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function fmtDate(d) { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }

/* =========================================================
   INQUIRIES
   ========================================================= */
async function loadInquiries() {
  const el = document.getElementById("inquiries-list");
  el.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const items = await API.get("/api/inquiries");
    if (!items.length) { el.innerHTML = '<p class="empty">No inquiries yet.</p>'; return; }
    el.innerHTML = items.map((i) => `
      <div class="card-row">
        <div class="info">
          <h3>${esc(i.name)} <span class="badge ${i.status}">${i.status}</span></h3>
          <p>${esc(i.phone)} &middot; ${esc(i.email)} &middot; ${esc(i.product)}</p>
          <p>${esc(i.message)}</p>
          ${i.attachmentUrl ? `<p><a href="${i.attachmentUrl}" target="_blank">Attachment: ${esc(i.attachmentName || "file")}</a></p>` : ""}
          <div class="meta">${fmtDate(i.createdAt)}</div>
        </div>
        <div class="actions">
          <select data-id="${i._id}" class="status-select">
            <option value="new" ${i.status === "new" ? "selected" : ""}>New</option>
            <option value="contacted" ${i.status === "contacted" ? "selected" : ""}>Contacted</option>
            <option value="closed" ${i.status === "closed" ? "selected" : ""}>Closed</option>
          </select>
          <button class="btn btn-sm btn-danger" onclick="deleteInquiry('${i._id}')">Delete</button>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".status-select").forEach((sel) => {
      sel.addEventListener("change", async () => {
        try { await API.put(`/api/inquiries/${sel.dataset.id}`, { status: sel.value }); }
        catch (e) { alert(e.message); }
      });
    });
  } catch (e) {
    el.innerHTML = `<p class="empty">${esc(e.message)}</p>`;
  }
}
window.deleteInquiry = async (id) => {
  if (!confirm("Delete this inquiry?")) return;
  try { await API.delete(`/api/inquiries/${id}`); loadInquiries(); }
  catch (e) { alert(e.message); }
};

/* =========================================================
   BLOGS
   ========================================================= */
async function loadBlogs() {
  const el = document.getElementById("blogs-list");
  el.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const items = await API.get("/api/blogs/admin/all");
    if (!items.length) { el.innerHTML = '<p class="empty">No blogs yet.</p>'; return; }
    el.innerHTML = items.map((b) => `
      <div class="card-row">
        <div class="info">
          <h3>${esc(b.title)} ${b.featured ? '<span class="badge">Featured</span>' : ""} ${!b.published ? '<span class="badge new">Draft</span>' : ""}</h3>
          <p>${esc(b.category)} &middot; ${esc(b.readTime)}</p>
          <div class="meta">${fmtDate(b.date)}</div>
        </div>
        <div class="actions">
          <button class="btn btn-sm btn-secondary" onclick="editBlog('${b._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteBlog('${b._id}')">Delete</button>
        </div>
      </div>
    `).join("");
  } catch (e) {
    el.innerHTML = `<p class="empty">${esc(e.message)}</p>`;
  }
}

function blogForm(b = {}) {
  return `
    <h2>${b._id ? "Edit" : "New"} Blog</h2>
    <form id="blog-form">
      <div class="form-group"><label>Title *</label><input name="title" value="${esc(b.title)}" required /></div>
      <div class="form-group"><label>Category</label><input name="category" value="${esc(b.category || "Buying Guide")}" /></div>
      <div class="form-group"><label>Excerpt *</label><textarea name="excerpt" required>${esc(b.excerpt)}</textarea></div>
      <div class="form-group">
        <label>Content *</label>
        <div id="quill-editor" style="background:#fff;"></div>
        <textarea name="content" id="content-hidden" style="display:none;" required></textarea>
      </div>
      <div class="form-group"><label>Read Time</label><input name="readTime" value="${esc(b.readTime || "5 min read")}" /></div>
      <div class="form-group"><label>SEO Title <small>(blank = use Title)</small></label><input name="metaTitle" value="${esc(b.metaTitle)}" /></div>
      <div class="form-group"><label>SEO Description <small>(blank = use Excerpt)</small></label><textarea name="metaDescription">${esc(b.metaDescription)}</textarea></div>
      <div class="form-group"><label>SEO Keywords <small>(comma separated)</small></label><input name="metaKeywords" value="${esc(b.metaKeywords)}" placeholder="plywood, bwp plywood, delhi" /></div>
      <div class="form-group"><label>Image ${b._id ? "(leave empty to keep current)" : "*"}</label><input type="file" name="image" accept="image/*" ${b._id ? "" : "required"} /></div>
      <div class="form-check"><input type="checkbox" name="featured" id="featured-chk" ${b.featured ? "checked" : ""} /><label for="featured-chk">Featured</label></div>
      <div class="form-check"><input type="checkbox" name="published" id="published-chk" ${b.published !== false ? "checked" : ""} /><label for="published-chk">Published</label></div>
      <div class="form-actions">
        <button type="submit" class="btn">Save</button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </form>
  `;
}

let quillInstance = null;
function initQuillEditor(initialHtml) {
  quillInstance = new Quill("#quill-editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "blockquote"],
        ["clean"],
      ],
    },
  });
  if (initialHtml) quillInstance.root.innerHTML = initialHtml;
}

document.getElementById("new-blog-btn").addEventListener("click", () => {
  openModal(blogForm());
  initQuillEditor("");
  bindBlogForm(null);
});
window.editBlog = async (id) => {
  const items = await API.get("/api/blogs/admin/all");
  const b = items.find((x) => x._id === id);
  openModal(blogForm(b));
  initQuillEditor(b.content);
  bindBlogForm(id);
};
function bindBlogForm(id) {
  document.getElementById("blog-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("content-hidden").value = quillInstance.root.innerHTML;
    const fd = new FormData(e.target);
    fd.set("featured", e.target.featured.checked);
    fd.set("published", e.target.published.checked);
    try {
      if (id) await API.put(`/api/blogs/${id}`, fd);
      else await API.post("/api/blogs", fd);
      closeModal();
      loadBlogs();
    } catch (err) { alert(err.message); }
  });
}
window.deleteBlog = async (id) => {
  if (!confirm("Delete this blog?")) return;
  try { await API.delete(`/api/blogs/${id}`); loadBlogs(); }
  catch (e) { alert(e.message); }
};

/* =========================================================
   GALLERY
   ========================================================= */
async function loadGallery() {
  const el = document.getElementById("gallery-list");
  el.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const items = await API.get("/api/gallery");
    if (!items.length) { el.innerHTML = '<p class="empty">No gallery images yet.</p>'; return; }
    el.innerHTML = items.map((g) => `
      <div class="grid-card">
        <img src="${g.image}" alt="${esc(g.title)}" />
        <div class="body">
          <h3>${esc(g.title)}</h3>
          <p style="font-size:12px;color:#999;">${esc(g.category)}</p>
          <div class="actions">
            <button class="btn btn-sm btn-secondary" onclick="editGallery('${g._id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteGallery('${g._id}')">Delete</button>
          </div>
        </div>
      </div>
    `).join("");
  } catch (e) {
    el.innerHTML = `<p class="empty">${esc(e.message)}</p>`;
  }
}
const galleryCats = ["store", "products", "projects", "materials", "customer"];
function galleryForm(g = {}) {
  return `
    <h2>${g._id ? "Edit" : "New"} Gallery Image</h2>
    <form id="gallery-form">
      <div class="form-group"><label>Title *</label><input name="title" value="${esc(g.title)}" required /></div>
      <div class="form-group">
        <label>Category *</label>
        <select name="category" required>
          ${galleryCats.map((c) => `<option value="${c}" ${g.category === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>
      <div class="form-group"><label>Image ${g._id ? "(leave empty to keep current)" : "*"}</label><input type="file" name="image" accept="image/*" ${g._id ? "" : "required"} /></div>
      <div class="form-actions">
        <button type="submit" class="btn">Save</button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </form>
  `;
}
document.getElementById("new-gallery-btn").addEventListener("click", () => {
  openModal(galleryForm());
  bindGalleryForm(null);
});
window.editGallery = async (id) => {
  const items = await API.get("/api/gallery");
  const g = items.find((x) => x._id === id);
  openModal(galleryForm(g));
  bindGalleryForm(id);
};
function bindGalleryForm(id) {
  document.getElementById("gallery-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (id) await API.put(`/api/gallery/${id}`, fd);
      else await API.post("/api/gallery", fd);
      closeModal();
      loadGallery();
    } catch (err) { alert(err.message); }
  });
}
window.deleteGallery = async (id) => {
  if (!confirm("Delete this image?")) return;
  try { await API.delete(`/api/gallery/${id}`); loadGallery(); }
  catch (e) { alert(e.message); }
};

/* =========================================================
   FAQS
   ========================================================= */
async function loadFaqs() {
  const el = document.getElementById("faqs-list");
  el.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const items = await API.get("/api/faqs/admin/all");
    if (!items.length) { el.innerHTML = '<p class="empty">No FAQs yet.</p>'; return; }
    el.innerHTML = items.map((f) => `
      <div class="card-row">
        <div class="info">
          <h3>${esc(f.question)} ${!f.published ? '<span class="badge new">Hidden</span>' : ""}</h3>
          <p>${esc(f.answer)}</p>
        </div>
        <div class="actions">
          <button class="btn btn-sm btn-secondary" onclick="editFaq('${f._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteFaq('${f._id}')">Delete</button>
        </div>
      </div>
    `).join("");
  } catch (e) {
    el.innerHTML = `<p class="empty">${esc(e.message)}</p>`;
  }
}
function faqForm(f = {}) {
  return `
    <h2>${f._id ? "Edit" : "New"} FAQ</h2>
    <form id="faq-form">
      <div class="form-group"><label>Question *</label><input name="question" value="${esc(f.question)}" required /></div>
      <div class="form-group"><label>Answer *</label><textarea name="answer" required>${esc(f.answer)}</textarea></div>
      <div class="form-group"><label>Order</label><input type="number" name="order" value="${f.order || 0}" /></div>
      <div class="form-check"><input type="checkbox" name="published" id="faq-published-chk" ${f.published !== false ? "checked" : ""} /><label for="faq-published-chk">Published</label></div>
      <div class="form-actions">
        <button type="submit" class="btn">Save</button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </form>
  `;
}
document.getElementById("new-faq-btn").addEventListener("click", () => {
  openModal(faqForm());
  bindFaqForm(null);
});
window.editFaq = async (id) => {
  const items = await API.get("/api/faqs/admin/all");
  const f = items.find((x) => x._id === id);
  openModal(faqForm(f));
  bindFaqForm(id);
};
function bindFaqForm(id) {
  document.getElementById("faq-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      question: e.target.question.value,
      answer: e.target.answer.value,
      order: Number(e.target.order.value) || 0,
      published: e.target.published.checked,
    };
    try {
      if (id) await API.put(`/api/faqs/${id}`, body);
      else await API.post("/api/faqs", body);
      closeModal();
      loadFaqs();
    } catch (err) { alert(err.message); }
  });
}
window.deleteFaq = async (id) => {
  if (!confirm("Delete this FAQ?")) return;
  try { await API.delete(`/api/faqs/${id}`); loadFaqs(); }
  catch (e) { alert(e.message); }
};

/* =========================================================
   PAGE META (SEO)
   ========================================================= */
const metaPages = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "blog", label: "Blog" },
  { key: "gallery", label: "Gallery" },
  { key: "contact", label: "Contact" },
];
async function loadMeta() {
  const el = document.getElementById("meta-list");
  el.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const items = await API.get("/api/meta/admin/all");
    const byPage = {};
    items.forEach((m) => (byPage[m.page] = m));
    el.innerHTML = metaPages.map((p) => {
      const m = byPage[p.key] || {};
      return `
        <div class="card-row">
          <div class="info">
            <h3>${p.label}</h3>
            <p>${esc(m.title || "Not set")}</p>
            <p style="font-size:12px;">${esc(m.description || "")}</p>
          </div>
          <div class="actions">
            <button class="btn btn-sm btn-secondary" onclick="editMeta('${p.key}', '${p.label}')">Edit</button>
          </div>
        </div>
      `;
    }).join("");
  } catch (e) {
    el.innerHTML = `<p class="empty">${esc(e.message)}</p>`;
  }
}
window.editMeta = async (page, label) => {
  const items = await API.get("/api/meta/admin/all");
  const m = items.find((x) => x.page === page) || {};
  openModal(`
    <h2>${label} — Page Meta</h2>
    <form id="meta-form">
      <div class="form-group"><label>SEO Title *</label><input name="title" value="${esc(m.title)}" required /></div>
      <div class="form-group"><label>Meta Description *</label><textarea name="description" required>${esc(m.description)}</textarea></div>
      <div class="form-group"><label>Meta Keywords <small>(comma separated)</small></label><input name="keywords" value="${esc(m.keywords)}" placeholder="plywood delhi, timber supplier" /></div>
      <div class="form-group"><label>Canonical URL (optional)</label><input name="canonical" value="${esc(m.canonical)}" placeholder="https://theplycompany.com/${page === "home" ? "" : page + ".html"}" /></div>
      <div class="form-group"><label>OG Image URL (optional)</label><input name="ogImage" value="${esc(m.ogImage)}" placeholder="/assets/img/hero.png" /></div>
      <div class="form-actions">
        <button type="submit" class="btn">Save</button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </form>
  `);
  document.getElementById("meta-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      title: e.target.title.value,
      description: e.target.description.value,
      keywords: e.target.keywords.value,
      canonical: e.target.canonical.value,
      ogImage: e.target.ogImage.value,
    };
    try {
      await API.put(`/api/meta/${page}`, body);
      closeModal();
      loadMeta();
    } catch (err) { alert(err.message); }
  });
};

/* ---------- Init ---------- */
function loadTab(tab) {
  if (tab === "inquiries") loadInquiries();
  if (tab === "blogs") loadBlogs();
  if (tab === "gallery") loadGallery();
  if (tab === "faqs") loadFaqs();
  if (tab === "meta") loadMeta();
}
loadTab("inquiries");
