(() => {
  const repositoryFallbacks = {
    "galactic-year": "Exploratory astronomical timing and orbital-period calculations centred on the Galactic year.",
    "SEGMENTED_SPACETIME": "Self-hosted interactive demonstrations and visual explanations of public Segmented Spacetime concepts.",
    "ssz-all-tests": "Cross-repository orchestration, captured run summaries and consistency reports for the public SSZ test suites.",
    "SSZ-METRIC_COMPLETE": "Collected SSZ metric derivations, implementations, comparisons and historical strong-field documentation."
    ,"ssz-recursive-closure-pc": "Executable recursive closure map, odd Sagnac sector and reduced Poincare-Cartan bookkeeping supplement."
  };
  const repositoryCorrections = {
    "segmented-calculation-suite": "Its public description still says singularity-free; P0 supersedes that global claim.",
    "ssz-metric-pure": "Its public description claims a complete singularity-free solution; the portal treats that wording as superseded by P0.",
    "frequency-curvature-validation": "The public test count is repository metadata and may differ from later all-tests snapshots.",
    "ssz-lensing": "The public description's 28-test count is historical; later snapshots use different collection units."
  };
  async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
  }

  function badge(value, className = "") {
    return `<span class="badge ${className}">${escapeHtml(value ?? "unknown")}</span>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  async function renderRepositories() {
    const target = document.getElementById("repository-catalog");
    if (!target) return;
    const search = document.getElementById("repository-search");
    const domain = document.getElementById("repository-domain");
    const state = document.getElementById("repository-state");
    const data = await loadJson("data/public-research-repositories.json");
    const roleData = await loadJson("data/repository-scientific-roles.json");
    const roles = Object.fromEntries(roleData.roles.map(role => [role.name, role]));
    const render = () => {
      const query = search.value.toLowerCase();
      const selectedDomain = domain.value;
      const selectedState = state.value;
      const rows = data.filter(repo =>
        (!query || JSON.stringify(repo).toLowerCase().includes(query)) &&
        (!selectedDomain || repo.domain === selectedDomain) &&
        (!selectedState || (selectedState === "archived") === repo.archived)
      );
      target.innerHTML = rows.map(repo => { const role=roles[repo.name] || {role:"Public research repository",status:["unclassified"],inputs:["portal catalogue"],outputs:["repository artefacts"],upstream:[],downstream:[],test_classes:["metadata review"],evidence_class:"metadata only",conflicts:[],does_not_prove:"The repository description alone does not prove its scientific claims."}; return `
        <article class="catalog-item" data-searchable>
          <h3><a href="${escapeHtml(repo.url)}" target="_blank" rel="noopener">${escapeHtml(repo.name)} <span aria-hidden="true">↗</span></a></h3>
          <p><strong>Scientific role:</strong> ${escapeHtml(role.role)}</p>
          <p>${escapeHtml(repo.description || repositoryFallbacks[repo.name] || "Public research repository; see the portal-owned role record below.")}</p>
          <div class="catalog-meta">${badge(repo.domain.replaceAll("-", " "))}${badge(repo.archived ? "archived" : "active", repo.archived ? "" : "canonical")}${repo.language ? badge(repo.language) : ""}${repo.topics.slice(0,5).map(x => badge(x)).join("")}</div>
          <div class="catalog-meta">${role.status.map(value => badge(value, value === "canonical" ? "canonical" : "")).join("")}${badge(role.evidence_class, "tested")}</div>
          <div class="repository-role-grid"><p><strong>Inputs:</strong> ${escapeHtml(role.inputs.join("; "))}</p><p><strong>Outputs:</strong> ${escapeHtml(role.outputs.join("; "))}</p><p><strong>Tests:</strong> ${escapeHtml(role.test_classes.join("; "))}</p><p><strong>Dependencies:</strong> ${escapeHtml(role.upstream.join("; "))} → ${escapeHtml(role.downstream.join("; "))}</p></div>
          ${(repo.portal_note || repositoryCorrections[repo.name]) ? `<div class="callout warning"><strong>Scientific scope note:</strong> ${escapeHtml(repo.portal_note || repositoryCorrections[repo.name])}</div>` : ""}
          <details class="repository-boundary"><summary>Evidence and boundary</summary><p><strong>Evidence class:</strong> ${escapeHtml(role.evidence_class)}</p><p><strong>Conflicts / supersession:</strong> ${escapeHtml(role.conflicts.length ? role.conflicts.join("; ") : "No portal conflict currently recorded.")}</p><p><strong>Does not prove:</strong> ${escapeHtml(role.does_not_prove)}</p></details>
          <p><strong>Default branch:</strong> <code>${escapeHtml(repo.default_branch || "unknown")}</code><br>
          <strong>Latest public push:</strong> ${escapeHtml((repo.pushed_at || "unknown").slice(0,10))}<br>
          <strong>Licence metadata:</strong> ${escapeHtml(repo.license || "not declared")} ·
          <strong>Stars / forks:</strong> ${repo.stars} / ${repo.forks}</p>
        </article>`; }).join("") || "<p>No repositories match this filter.</p>";
      document.getElementById("repository-count").textContent = `${rows.length} of ${data.length}`;
    };
    [search, domain, state].forEach(input => input.addEventListener("input", render));
    render();
  }

  async function renderTests() {
    const target = document.getElementById("test-catalog");
    if (!target) return;
    const search = document.getElementById("test-search");
    const category = document.getElementById("test-category");
    const data = await loadJson("data/tests.json");
    let page = 0;
    const pageSize = 40;
    const render = () => {
      const query = search.value.toLowerCase();
      const selected = category.value;
      const rows = data.tests.filter(test =>
        (!query || JSON.stringify(test).toLowerCase().includes(query)) &&
        (!selected || test.category === selected)
      );
      const pages = Math.max(1, Math.ceil(rows.length / pageSize));
      page = Math.min(page, pages - 1);
      const visible = rows.slice(page * pageSize, (page + 1) * pageSize);
      target.innerHTML = visible.map(test => `
        <tr>
          <td><strong>${test.test_name}</strong><br><small>${test.repository}</small></td>
          <td>${badge(test.category, "tested")}</td>
          <td>${test.quantity}</td>
          <td><code>${test.file}</code></td>
          <td>${test.meaning}<br><small><strong>Does not prove:</strong> ${test.does_not_prove}</small></td>
          <td><code>${test.command}</code></td>
        </tr>`).join("");
      document.getElementById("test-count").textContent = `${rows.length.toLocaleString("en-US")} of ${data.count.toLocaleString("en-US")}`;
      document.getElementById("test-page").textContent = `Page ${page + 1} / ${pages}`;
      document.getElementById("test-prev").disabled = page === 0;
      document.getElementById("test-next").disabled = page >= pages - 1;
    };
    document.getElementById("test-prev").addEventListener("click", () => { page--; render(); });
    document.getElementById("test-next").addEventListener("click", () => { page++; render(); });
    [search, category].forEach(input => input.addEventListener("input", () => { page = 0; render(); }));
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderRepositories().catch(console.error);
    renderTests().catch(console.error);
  });
})();
