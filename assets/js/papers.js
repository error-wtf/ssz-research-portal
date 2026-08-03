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
      const linked = Boolean(paper.public_url);
      return (!query || text.includes(query)) &&
        (!topic || paper.topic === topic) &&
        (!status || (status === "historical" && paper.status.startsWith("historical")) ||
          (status === "current" && !paper.status.startsWith("historical")) ||
          (status === "linked" && linked));
    });
    document.getElementById("paper-status").textContent = `${shown.length} of ${state.papers.length} primary papers shown.`;
    document.getElementById("paper-list").innerHTML = shown.map(paper => {
      const historic = paper.status.startsWith("historical");
      const linked = Boolean(paper.public_url);
      return `<article class="paper-card">
        <div class="paper-number">${String(paper.number).padStart(2, "0")}</div>
        <div><div class="paper-meta"><span class="badge ${historic ? "corrected" : "canonical"}">${escape(paper.status)}</span><span>${escape(paper.year)}</span><span>${escape(paper.topic)}</span></div>
        <h3>${escape(paper.title)}</h3><p>${escape(paper.authors)}</p>
        <p>${escape(paper.summary || "Summary pending source review.")}</p>
        <p class="scope-note">${escape(paper.scope_note)}</p>
        ${historic ? `<p class="callout"><strong>Planned clarification:</strong> when time permits, a fundamentally explanatory and supplementary paper may follow. Careful follow-up across all of our projects takes time; the current P0 boundary shown here applies meanwhile.</p>` : ""}
        <div class="paper-actions">${linked ? `<a href="${escape(paper.public_url)}" target="_blank" rel="noopener">Public publication page</a>` : `<span class="scope-note">Item-level public page not yet verified</span>`}
        ${paper.manuscript_url ? `<a href="${escape(paper.manuscript_url)}" target="_blank" rel="noopener">Read source manuscript</a>` : ""}
        <code>${escape(paper.key)}</code><span>${escape(paper.peer_review)}</span></div></div>
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
      document.getElementById("linked-count").textContent = state.papers.filter(p => Boolean(p.public_url)).length;
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
