(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("ssz-theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  if (localStorage.getItem("ssz-reviewer") === "true") root.dataset.reviewer = "true";

  document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".nav-links");
    if (menu) {
      const here = location.pathname.split("/").pop() || "index.html";
      const link = (href,label) => `<a href="${href}"${here===href?' aria-current="page"':''}>${label}</a>`;
      // Keep all groups collapsed by default. The current page remains marked
      // with aria-current, but opening a group is an explicit user action.
      const group = (label, entries) => `<details class="nav-group"${entries.some(([href])=>href===here)?" open":""}><summary>${label}</summary><div class="nav-submenu">${entries.map(([href,text])=>link(href,text)).join("")}</div></details>`;
      menu.innerHTML = [
        link("index.html","Overview"),
        group("Learn", [["theory.html","Theory"],["formulas.html","Formulas"],["regimes.html","Regimes"],["weak-field.html","Weak field"],["strong-field.html","Strong field"],["interior-global-structure.html","Interior"],["glossary.html","Glossary"]]),
        group("Models", [["metric.html","Metric"],["dynamics-energy.html","Dynamics & Energy"],["mathematics.html","Mathematics"],["qubits.html","Qubits"]]),
        link("jif.html","JIF"),
        link("visual-lab.html","Visual lab"),
        group("Evidence", [["workbench.html","Workbench"],["tests.html","Tests"],["evidence.html","Evidence"],["falsification.html","Falsification"]]),
        group("Research", [["observations.html","Observables"],["papers.html","Papers"],["research.html","Research archive"],["repositories.html","Repositories"],["atlas.html","Atlas"]]),
        link("reproducibility.html","Reproduce"),
        `<button class="nav-button reviewer-toggle" data-reviewer-toggle aria-pressed="${root.dataset.reviewer==="true"}">${root.dataset.reviewer==="true"?"Reviewer: ON":"Reviewer: OFF"}</button><button class="nav-button" data-theme-toggle>◐ Theme</button>`
      ].join("");
    }
    const toggle = document.querySelector(".menu-toggle");
    toggle?.addEventListener("click", () => {
      const open = menu?.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(Boolean(open)));
    });

    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      button.addEventListener("click", () => {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("ssz-theme", root.dataset.theme);
        window.dispatchEvent(new CustomEvent("ssz-theme-change"));
      });
    });
    document.querySelectorAll("[data-reviewer-toggle]").forEach(button=>button.addEventListener("click",()=>{
      const enabled=root.dataset.reviewer!=="true";root.dataset.reviewer=String(enabled);
      localStorage.setItem("ssz-reviewer",String(enabled));localStorage.setItem("ssz-reviewer-toggles",String(Number(localStorage.getItem("ssz-reviewer-toggles")||0)+1));button.textContent=enabled?"Reviewer: ON":"Reviewer: OFF";button.setAttribute("aria-pressed",String(enabled));renderReviewerPanel();
    }));
    function renderReviewerPanel(){let panel=document.getElementById("reviewer-panel");if(root.dataset.reviewer!=="true"){panel?.remove();return;}if(!panel){panel=document.createElement("aside");panel.id="reviewer-panel";panel.className="reviewer-panel";panel.setAttribute("aria-live","polite");document.body.append(panel);}const views=Number(localStorage.getItem("ssz-reviewer-views")||0)+1;localStorage.setItem("ssz-reviewer-views",String(views));panel.innerHTML=`<strong>Reviewer mode active</strong><span>Report scientific, code or provenance issues:</span><a href="mailto:mail@error.wtf?subject=SSZ%20Research%20Portal%20review">mail@error.wtf</a><small>Local browser statistics: ${views} reviewer-mode page activations · ${Number(localStorage.getItem("ssz-reviewer-toggles")||0)} toggles. No data is transmitted.</small>`;}
    renderReviewerPanel();

    // Full-resolution research-archive images stay on the page and close via
    // Escape, the close button or a click on the dark backdrop.
    document.querySelectorAll('.plot-gallery a[href$=".png"], .plot-gallery a[href$=".jpg"], .plot-gallery a[href$=".jpeg"], .plot-gallery a[href$=".webp"]').forEach(anchor => {
      anchor.addEventListener('click', event => {
        event.preventDefault();
        const overlay = document.createElement('div');
        overlay.className = 'image-lightbox';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        const image = document.createElement('img');
        image.src = anchor.href;
        image.alt = anchor.querySelector('img')?.alt || 'Full-resolution research figure';
        const close = document.createElement('button');
        close.type = 'button';
        close.textContent = '× Close (Esc)';
        const caption = anchor.closest('figure')?.querySelector('figcaption')?.textContent.trim();
        overlay.append(close, image);
        if (caption) { const text = document.createElement('figcaption'); text.textContent = caption; overlay.append(text); }
        const remove = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
        const onKey = event => { if (event.key === 'Escape') remove(); };
        close.addEventListener('click', remove);
        overlay.addEventListener('click', event => { if (event.target === overlay) remove(); });
        document.addEventListener('keydown', onKey);
        document.body.append(overlay);
        close.focus();
      });
    });

    document.querySelectorAll("[data-copy]").forEach(button => {
      button.addEventListener("click", async () => {
        const selector = button.getAttribute("data-copy");
        const source = document.querySelector(selector);
        if (!source) return;
        await navigator.clipboard.writeText(source.textContent.trim());
        const old = button.textContent;
        button.textContent = "Copied";
        setTimeout(() => { button.textContent = old; }, 1300);
      });
    });

    document.querySelectorAll("h2[id], h3[id]").forEach(heading => {
      heading.title = "Copy permalink";
      heading.addEventListener("click", async event => {
        if (event.target.closest("a,button")) return;
        history.replaceState(null, "", `#${heading.id}`);
        await navigator.clipboard?.writeText(location.href);
      });
    });

    const search = document.querySelector("[data-page-search]");
    if (search) {
      const items = [...document.querySelectorAll("[data-searchable]")];
      search.addEventListener("input", () => {
        const query = search.value.trim().toLowerCase();
        items.forEach(item => {
          item.hidden = Boolean(query) && !item.textContent.toLowerCase().includes(query);
        });
      });
    }
  });
})();
