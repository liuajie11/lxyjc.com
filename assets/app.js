(function () {
  const data = window.SITE_CONTENT;
  const pageKey = document.body.dataset.page || "recommendations";
  const page = data.pages[pageKey] || data.pages.recommendations;
  const currentLabel = data.nav.find(item => item[0] === pageKey)?.[1] || "首页";
  if (!document.title || document.title === "良心云观察站") {
    document.title = `${currentLabel} · 良心云观察站 (lxyjc.com)`;
  }

  const nav = document.querySelector("#main-nav");
  nav.innerHTML = data.nav.map(([key, label, href]) => `<a class="nav-link ${key === pageKey ? "active" : ""}" href="${href}">${label}</a>`).join("");

  document.querySelector("#left-sidebar").innerHTML = `<p class="side-label">频道目录</p>` + page.sidebar.map(([title, links]) => `
    <div class="side-group"><div class="side-group-title"><span class="side-dot"></span>${title}</div><div class="side-links">
      ${links.map(([label, href]) => `<a class="side-link" href="${href}">${label}</a>`).join("")}
    </div></div>`).join("");

  const main = document.querySelector("#main-content");
  main.innerHTML = `
    <div class="breadcrumb"><a href="index.html">良心云观察站</a><span>›</span><span>${currentLabel}</span></div>
    <header class="hero">
      <div class="eyebrow">● ${page.eyebrow}</div>
      <h1>${page.title}</h1>
      <p class="hero-description">${page.description}</p>
      <div class="hero-meta">${page.meta.map(x => `<span>✓ ${x}</span>`).join("")}</div>
      <div class="stat-grid">${page.stats.map(([value, label]) => `<div class="stat-card"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`).join("")}</div>
    </header>
    ${page.sections.map(section => `<section class="article-section" id="${section.id}"><div class="section-kicker">${section.kicker}</div><h2>${section.title}</h2>${section.html}</section>`).join("")}`;

  const sections = [...document.querySelectorAll(".article-section")];
  const outline = document.querySelector("#outline");
  outline.innerHTML = `<p class="side-label">本页大纲</p><div class="progress-track"><div class="progress-bar" id="progress-bar"></div></div>` + sections.map(section => `<a class="outline-link" href="#${section.id}">${section.querySelector("h2").textContent}</a>`).join("") + `<div class="trust-card"><strong>独立与透明</strong>示例数据会明确标注；正式结论应附测试时间、环境与商业关系。</div>`;

  const outlineLinks = [...document.querySelectorAll(".outline-link")];
  const sideLinks = [...document.querySelectorAll(".side-link")];
  const activate = id => {
    [...outlineLinks, ...sideLinks].forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
  };

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(x => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) activate(visible.target.id);
  }, { rootMargin: "-18% 0px -67% 0px", threshold: 0 });
  sections.forEach(section => observer.observe(section));

  const progress = document.querySelector("#progress-bar");
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, window.scrollY / max * 100) : 0}%`;
  }, { passive: true });

  const menuButton = document.querySelector("#menu-button");
  const closeMenu = () => document.body.classList.remove("menu-open");
  menuButton.addEventListener("click", () => document.body.classList.toggle("menu-open"));
  document.querySelector("#mobile-overlay").addEventListener("click", closeMenu);
  nav.addEventListener("click", closeMenu);

  const modal = document.querySelector("#search-modal");
  const input = document.querySelector("#search-input");
  const results = document.querySelector("#search-results");
  const searchable = [
    ...data.nav.map(([key, label, href]) => ({ label, href, text: data.pages[key]?.description || "" })),
    ...Object.entries(data.pages).flatMap(([pageKey, p]) => {
      const pageHref = data.nav.find(n => n[0] === pageKey)?.[2] || `${pageKey}.html`;
      return (p.sections || []).map(s => ({
        label: s.title,
        href: `${pageHref}#${s.id}`,
        text: `${p.eyebrow || ""} · ${s.kicker || ""}`
      }));
    })
  ];
  function renderSearch(query = "") {
    const q = query.trim().toLowerCase();
    const items = searchable.filter(item => !q || `${item.label}${item.text}`.toLowerCase().includes(q));
    results.innerHTML = items.map(item => `<a class="search-result" href="${item.href}"><strong>${item.label}</strong><span>${item.text}</span></a>`).join("") || `<div class="search-result"><span>没有找到匹配栏目</span></div>`;
  }
  const openSearch = () => { modal.classList.add("open"); renderSearch(); setTimeout(() => input.focus(), 50); };
  const closeSearch = () => modal.classList.remove("open");
  document.querySelector("#search-button").addEventListener("click", openSearch);
  modal.addEventListener("click", e => { if (e.target === modal) closeSearch(); });
  input.addEventListener("input", e => renderSearch(e.target.value));
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
    if (e.key === "Escape") { closeSearch(); closeMenu(); }
  });

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-code]");
    if (el) {
      const code = el.getAttribute("data-code");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          const oldText = el.textContent;
          el.textContent = "✓ 已复制 " + code;
          setTimeout(() => { el.textContent = oldText; }, 1800);
        }).catch(() => {
          prompt("请手动复制优惠码：", code);
        });
      } else {
        prompt("请手动复制优惠码：", code);
      }
    }
  });

  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const footerLastSpan = document.querySelector(".footer-inner > span:last-child");
  if (footerLastSpan && !footerLastSpan.querySelector("a[href='sitemap.xml']")) {
    const sitemapLink = document.createElement("a");
    sitemapLink.href = "sitemap.xml";
    sitemapLink.textContent = "网站地图";
    sitemapLink.style.cssText = "color:inherit;text-decoration:none;margin-right:12px;opacity:0.85;";
    sitemapLink.onmouseover = () => sitemapLink.style.textDecoration = "underline";
    sitemapLink.onmouseout = () => sitemapLink.style.textDecoration = "none";
    footerLastSpan.prepend(sitemapLink);
  }
})();

