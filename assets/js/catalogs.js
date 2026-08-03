(() => {
  async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
  }

  function badge(value, className = "") {
    return `<span class="badge ${className}">${String(value ?? "unknown")}</span>`;
  }

  async function renderRepositories() {
    const target = document.getElementById("repository-catalog");
    if (!target) return;
    const search = document.getElementById("repository-search");
    const tag = document.getElementById("repository-tag");
    const data = await loadJson("data/repositories.json");
    const render = () => {
      const query = search.value.toLowerCase();
      const selected = tag.value;
      const rows = data.repositories.filter(repo =>
        (!query || JSON.stringify(repo).toLowerCase().includes(query)) &&
        (!selected || repo.tags.includes(selected))
      );
      target.innerHTML = rows.map(repo => `
        <article class="catalog-item" data-searchable>
          <h3>${repo.public_url ? `<a href="${repo.public_url}" rel="noopener">${repo.name}</a>` : repo.name}</h3>
          <p>${repo.description}</p>
          <div class="catalog-meta">${repo.tags.map(x => badge(x)).join("")}${badge(repo.status, repo.status === "active" ? "canonical" : "")}</div>
          <p><strong>Role:</strong> ${repo.scientific_role}<br>
          <strong>Branch / commit:</strong> ${repo.default_branch || "unknown"} / <code>${repo.commit || "unknown"}</code><br>
          <strong>Inventory:</strong> ${repo.file_count.toLocaleString("en-US")} files; ${repo.test_related_files.toLocaleString("en-US")} test-related artefacts<br>
          <strong>Public source reference:</strong> <code>${repo.local_reference}</code></p>
        </article>`).join("") || "<p>No repositories match this filter.</p>";
      document.getElementById("repository-count").textContent = `${rows.length} of ${data.count}`;
    };
    [search, tag].forEach(input => input.addEventListener("input", render));
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
