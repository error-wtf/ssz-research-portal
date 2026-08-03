(() => {
  "use strict";
  const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const formatBytes=bytes=>bytes<1e6?`${(bytes/1e3).toFixed(1)} kB`:`${(bytes/1e6).toFixed(1)} MB`;
  const colours={"theory-and-geometry":"#b8860b","data-and-validation":"#2563eb","simulation-and-visualisation":"#7c3aed","mathematics":"#087f5b","research-archive":"#b42318"};
  let data=[],nodes=[],selected="";
  const textColour=()=>getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
  const lineColour=()=>getComputedStyle(document.documentElement).getPropertyValue("--line").trim();

  function drawMap(){
    const canvas=document.getElementById("atlas-map");if(!canvas||!data.length)return;
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.max(320,rect.width||1000),h=Math.max(420,rect.height||600);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);const c=canvas.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
    const domains=[...new Set(data.map(repo=>repo.domain))],centres=Object.fromEntries(domains.map((domain,index)=>{const angle=-Math.PI/2+index*Math.PI*2/domains.length;return[domain,{x:w/2+Math.cos(angle)*w*.27,y:h/2+Math.sin(angle)*h*.28}];}));
    nodes=data.map((repo,index)=>{const centre=centres[repo.domain],angle=index*2.399963,radius=18+Math.sqrt(index%8)*20;return{repo,x:centre.x+Math.cos(angle)*radius,y:centre.y+Math.sin(angle)*radius,r:5+Math.log10(repo.counts.files+1)*3.2};});
    c.strokeStyle=lineColour();c.globalAlpha=.4;
    nodes.forEach(node=>{const centre=centres[node.repo.domain];c.beginPath();c.moveTo(node.x,node.y);c.lineTo(centre.x,centre.y);c.stroke();});c.globalAlpha=1;
    domains.forEach(domain=>{const centre=centres[domain];c.fillStyle=colours[domain];c.globalAlpha=.12;c.beginPath();c.arc(centre.x,centre.y,72,0,Math.PI*2);c.fill();c.globalAlpha=1;c.fillStyle=textColour();c.font="700 12px Inter";c.textAlign="center";c.fillText(domain.replaceAll("-"," "),centre.x,centre.y-78);});
    nodes.forEach(node=>{c.fillStyle=colours[node.repo.domain];c.beginPath();c.arc(node.x,node.y,node.r,0,Math.PI*2);c.fill();if(node.repo.name===selected){c.strokeStyle=textColour();c.lineWidth=3;c.stroke();}});
    c.fillStyle=textColour();c.font="600 11px Inter";c.textAlign="center";nodes.filter(node=>node.r>13||node.repo.name===selected).forEach(node=>c.fillText(node.repo.name,node.x,node.y+node.r+13));
  }
  function fileUrl(repo,path){
    if(!repo.public_url)return"";
    const marker=`physics/${repo.name}/`,relative=path.startsWith(marker)?path.slice(marker.length):path;
    return `${repo.public_url.replace(/\/$/,"")}/blob/${encodeURIComponent(repo.default_branch||"main")}/${relative.split("/").map(encodeURIComponent).join("/")}`;
  }
  function listPaths(repo,title,paths){return paths.length?`<details><summary>${title} (${paths.length})</summary><ul>${paths.map(path=>{const url=fileUrl(repo,path);return`<li>${url?`<a href="${escapeHtml(url)}" target="_blank" rel="noopener"><code>${escapeHtml(path)}</code></a>`:`<code>${escapeHtml(path)}</code>`}</li>`}).join("")}</ul></details>`:"";}
  function render(){
    const query=document.getElementById("atlas-search").value.toLowerCase(),domain=document.getElementById("atlas-domain").value,sort=document.getElementById("atlas-sort").value;
    let rows=data.filter(repo=>(!query||JSON.stringify(repo).toLowerCase().includes(query))&&(!domain||repo.domain===domain)&&(!selected||repo.name===selected));
    rows.sort(sort==="files"?(a,b)=>b.counts.files-a.counts.files:sort==="tests"?(a,b)=>b.counts.tests-a.counts.tests:sort==="images"?(a,b)=>b.counts.images-a.counts.images:(a,b)=>a.name.localeCompare(b.name));
    document.getElementById("atlas-count").textContent=`${rows.length} of ${data.length}`;
    document.getElementById("atlas-list").innerHTML=rows.map(repo=>`<article class="atlas-card">
      <div class="atlas-card-head"><div><span class="badge" style="border-color:${colours[repo.domain]};color:${colours[repo.domain]}">${escapeHtml(repo.domain.replaceAll("-"," "))}</span><h3>${repo.public_url?`<a href="${escapeHtml(repo.public_url)}" rel="noopener">${escapeHtml(repo.name)}</a>`:escapeHtml(repo.name)}</h3></div><span class="badge ${repo.archived?"":"canonical"}">${repo.archived?"archived":"active/local"}</span></div>
      <p>${escapeHtml(repo.summary)}</p>${repo.scope_note?`<div class="callout warning"><strong>Scope note:</strong> ${escapeHtml(repo.scope_note)}</div>`:""}
      <div class="atlas-stats"><span><strong>${repo.counts.files.toLocaleString()}</strong> files</span><span><strong>${repo.counts.tests.toLocaleString()}</strong> test artefacts</span><span><strong>${repo.counts.documents.toLocaleString()}</strong> documents</span><span><strong>${repo.counts.images.toLocaleString()}</strong> images</span><span><strong>${formatBytes(repo.counts.bytes)}</strong> total</span></div>
      <div class="catalog-meta">${repo.roles.map(role=>`<span class="badge">${escapeHtml(role)}</span>`).join("")}${repo.languages.slice(0,5).map(item=>`<span class="badge">${escapeHtml(item.extension)} · ${item.count}</span>`).join("")}</div>
      <p><strong>Branch / commit:</strong> <code>${escapeHtml(repo.default_branch||"unknown")}</code> / <code>${escapeHtml(repo.commit||"unknown")}</code></p>
      ${listPaths(repo,"Key documents",repo.key_documents)}${listPaths(repo,"Results, reports and locks",repo.result_files)}
    </article>`).join("")||"<p>No repository matches the current filters.</p>";
    drawMap();
  }
  function pick(event){
    const canvas=document.getElementById("atlas-map"),rect=canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    const hit=nodes.find(node=>Math.hypot(node.x-x,node.y-y)<=node.r+5);if(!hit)return;
    selected=selected===hit.repo.name?"":hit.repo.name;render();document.getElementById("atlas-list").scrollIntoView({behavior:"smooth",block:"start"});
  }
  document.addEventListener("DOMContentLoaded",async()=>{
    const response=await fetch("data/physics-atlas.json");if(!response.ok)throw new Error(`physics-atlas.json: ${response.status}`);const payload=await response.json();data=payload.repositories;
    ["atlas-search","atlas-domain","atlas-sort"].forEach(id=>document.getElementById(id).addEventListener("input",()=>{selected="";render();}));
    document.getElementById("atlas-map").addEventListener("click",pick);addEventListener("resize",drawMap);addEventListener("ssz-theme-change",drawMap);render();
  });
})();
