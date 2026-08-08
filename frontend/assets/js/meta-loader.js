(function () {
  const page = document.body.getAttribute("data-page");
  if (!page || page === "blog-detail") return; // blog-detail sets its own meta from the blog
  fetch("/api/meta/" + page)
    .then((r) => (r.ok ? r.json() : null))
    .then((m) => {
      if (!m) return;
      if (m.title) document.title = m.title;
      const setMeta = (sel, attr, val) => {
        if (!val) return;
        let el = document.querySelector(sel);
        if (!el) {
          el = document.createElement("meta");
          if (sel.includes("property")) el.setAttribute("property", sel.match(/"([^"]+)"/)[1]);
          else el.setAttribute("name", sel.match(/"([^"]+)"/)[1]);
          document.head.appendChild(el);
        }
        el.setAttribute(attr, val);
      };
      setMeta('meta[name="description"]', "content", m.description);
      setMeta('meta[name="keywords"]', "content", m.keywords);
      setMeta('meta[property="og:title"]', "content", m.title);
      setMeta('meta[property="og:description"]', "content", m.description);
      if (m.ogImage) setMeta('meta[property="og:image"]', "content", m.ogImage);
      if (m.canonical) {
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
        link.setAttribute("href", m.canonical);
      }
    })
    .catch(() => {});
})();
