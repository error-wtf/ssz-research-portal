(() => {
  "use strict";
  const profile = "https://www.researchgate.net/profile/Carmen-Wrede/research";
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const state = { papers: [] };

  function render() {
    const query = document.getElementById("paper-search").value.trim().toLowerCase();
    const topic = document.getElementById("paper-topic").value;
    const status = document.getElementById("paper-status-filter").value;
    const shown = state.papers.filter(paper => {
      const text = `${paper.title} ${paper.authors} ${paper.topic} ${paper.status} ${paper.scope_note}`.toLowerCase();
      const linked = paper.public_url !== profile;
      return (!query || text.includes(query)) &&
        (!topic || paper.topic === topic) &&
        (!status || (status === "historical" && paper.status.startsWith("historical")) ||
          (status === "current" && !paper.status.startsWith("historical")) ||
          (status === "linked" && linked));
    });
    document.getElementById("paper-status").textContent = `${shown.length} of ${state.papers.length} primary papers shown.`;
    document.getElementById("paper-list").innerHTML = shown.map(paper => {
      const historic = paper.status.startsWith("historical");
      const linked = paper.public_url !== profile;
      return `<article class="paper-card">
        <div class="paper-number">${String(paper.number).padStart(2, "0")}</div>
        <div><div class="paper-meta"><span class="badge ${historic ? "corrected" : "canonical"}">${escape(paper.status)}</span><span>${escape(paper.year)}</span><span>${escape(paper.topic)}</span></div>
        <h3>${escape(paper.title)}</h3><p>${escape(paper.authors)}</p>
        <p class="scope-note">${escape(paper.scope_note)}</p>
        <div class="paper-actions"><a href="${escape(paper.public_url)}" target="_blank" rel="noopener">${linked ? "Open verified public item" : "Search public profile"}</a><code>${escape(paper.key)}</code><span>${escape(paper.peer_review)}</span></div></div>
      </article>`;
    }).join("") || `<div class="callout">No papers match these filters.</div>`;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("data/papers.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      state.papers = data.papers;
      document.getElementById("paper-count").textContent = data.count;
      document.getElementById("linked-count").textContent = state.papers.filter(p => p.public_url !== profile).length;
      document.getElementById("historic-count").textContent = state.papers.filter(p => p.status.startsWith("historical")).length;
      const topics = [...new Set(state.papers.map(p => p.topic))].sort();
      document.getElementById("paper-topic").insertAdjacentHTML("beforeend", topics.map(value => `<option>${escape(value)}</option>`).join(""));
      ["paper-search", "paper-topic", "paper-status-filter"].forEach(id =>
        document.getElementById(id).addEventListener("input", render));
      render();
    } catch (error) {
      document.getElementById("paper-status").textContent = `The paper catalogue could not be loaded: ${error.message}`;
    }
  });
})();
