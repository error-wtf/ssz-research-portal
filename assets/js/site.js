(() => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("ssz-theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  if (localStorage.getItem("ssz-reviewer") === "true") root.dataset.reviewer = "true";

  document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".nav-links");
    if (menu) menu.style.visibility = "hidden";
    if (menu) {
      const pages = [["index.html","Overview"],["theory.html","Theory"],["regimes.html","Regimes"],["weak-field.html","Weak field"],["strong-field.html","Strong field"],["interior-global-structure.html","Interior"],["formulas.html","Formulas"],["visual-lab.html","Visual lab"],["workbench.html","Workbench"],["qubits.html","Qubits"],["tests.html","Tests"],["evidence.html","Evidence"],["repositories.html","Repositories"],["papers.html","Papers"],["reproducibility.html","Reproduce"],["falsification.html","Falsification"],["glossary.html","Glossary"],["atlas.html","Atlas"]];
      const here = location.pathname.split("/").pop() || "index.html";
      menu.innerHTML = pages.map(([href,label])=>`<a href="${href}"${here===href?' aria-current="page"':''}>${label}</a>`).join("") + `<button class="nav-button reviewer-toggle" data-reviewer-toggle aria-pressed="${root.dataset.reviewer==="true"}">${root.dataset.reviewer==="true"?"Reviewer: ON":"Reviewer: OFF"}</button><button class="nav-button" data-theme-toggle>◐ Theme</button>`;
      menu.style.visibility = "visible";
    }
    if (menu && !menu.querySelector('a[href="formulas.html"]')) {
      const link = document.createElement("a");
      link.href = "formulas.html";
      link.textContent = "Formulas";
      if (location.pathname.endsWith("/formulas.html")) link.setAttribute("aria-current", "page");
      const strong = menu.querySelector('a[href="strong-field.html"]');
      menu.insertBefore(link, strong || menu.querySelector("[data-theme-toggle]"));
    }
    if (menu && !menu.querySelector('a[href="visual-lab.html"]')) {
      const link = document.createElement("a");
      link.href = "visual-lab.html";
      link.textContent = "Visual lab";
      if (location.pathname.endsWith("/visual-lab.html")) link.setAttribute("aria-current", "page");
      const tests = menu.querySelector('a[href="tests.html"]');
      menu.insertBefore(link, tests || menu.querySelector("[data-theme-toggle]"));
    }
    if (menu && !menu.querySelector('a[href="atlas.html"]')) {
      const link = document.createElement("a");
      link.href = "atlas.html";
      link.textContent = "Atlas";
      if (location.pathname.endsWith("/atlas.html")) link.setAttribute("aria-current", "page");
      const repositories = menu.querySelector('a[href="repositories.html"]');
      menu.insertBefore(link, repositories || menu.querySelector("[data-theme-toggle]"));
    }
    if (menu && !menu.querySelector('a[href="papers.html"]')) {
      const link = document.createElement("a");
      link.href = "papers.html";
      link.textContent = "Papers";
      if (location.pathname.endsWith("/papers.html")) link.setAttribute("aria-current", "page");
      const tests = menu.querySelector('a[href="tests.html"]');
      menu.insertBefore(link, tests || menu.querySelector("[data-theme-toggle]"));
    }
    [
      ["regimes.html","Regimes","strong-field.html"],
      ["interior-global-structure.html","Interior","tests.html"],
      ["evidence.html","Evidence","repositories.html"],
      ["falsification.html","Falsification","glossary.html"],
      ["workbench.html","Workbench","tests.html"],
    ].forEach(([href,label,before])=>{
      if(!menu||menu.querySelector(`a[href="${href}"]`))return;
      const link=document.createElement("a");link.href=href;link.textContent=label;
      if(location.pathname.endsWith(`/${href}`))link.setAttribute("aria-current","page");
      menu.insertBefore(link,menu.querySelector(`a[href="${before}"]`)||menu.querySelector("[data-theme-toggle]"));
    });
    if(menu&&!menu.querySelector("[data-reviewer-toggle]")){
      const button=document.createElement("button");button.className="nav-button";button.dataset.reviewerToggle="";
      button.textContent=root.dataset.reviewer==="true"?"Reviewer: ON":"Reviewer: OFF";
      menu.insertBefore(button,menu.querySelector("[data-theme-toggle]"));
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
      localStorage.setItem("ssz-reviewer",String(enabled));button.textContent=enabled?"Reviewer: ON":"Reviewer: OFF";button.setAttribute("aria-pressed",String(enabled));
    }));

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
