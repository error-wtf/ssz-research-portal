#!/usr/bin/env node
/* Browser-level smoke test for scientific details and navigation behaviour.
 * Uses the installed headless Chromium so native <details>/<summary> semantics
 * and the published site JavaScript are exercised together. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const {spawnSync} = require("node:child_process");

const root = path.resolve(__dirname, "..");
const mime = {".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".gif":"image/gif"};
const pages = fs.readdirSync(root).filter(name => name.endsWith(".html")).sort();
const harness = `<!doctype html><meta charset="utf-8"><iframe id="page"></iframe><pre id="result"></pre><script>
const pages=${JSON.stringify(pages)}; const out=[]; const frame=document.querySelector('#page');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function check(page){
  frame.src='/' + page; await new Promise((resolve,reject)=>{frame.onload=resolve; frame.onerror=reject}); await wait(90);
  const d=frame.contentDocument, nav=d.querySelector('.nav-links');
  if(!nav) throw Error(page+': navigation missing');
  const groups=[...nav.querySelectorAll('details.nav-group')];
  if(groups.some(x=>x.open)) throw Error(page+': nav group open on initial load');
  if(!d.querySelector('[aria-current="page"]')) throw Error(page+': active-page marker missing');
  if(groups.length>1){ groups[0].querySelector('summary').click(); if(!groups[0].open) throw Error(page+': group A did not open'); groups[1].querySelector('summary').click(); if(groups[0].open||!groups[1].open) throw Error(page+': accordion rule failed'); }
  const anchor=groups.at(-1)?.querySelector('a'); if(anchor){ anchor.click(); if(groups.at(-1).open||nav.classList.contains('open')) throw Error(page+': submenu/mobile drawer did not close'); }
  const details=[...d.querySelectorAll('main details')];
  for(const item of details){ const summary=item.querySelector(':scope > summary'); if(!summary) continue; item.removeAttribute('open'); summary.click(); if(!item.open) throw Error(page+': details did not open'); summary.click(); if(item.open) throw Error(page+': details did not close'); }
  out.push(page+': PASS ('+details.length+' details, '+groups.length+' nav groups)');
}
(async()=>{try{for(const p of pages) await check(p); document.querySelector('#result').textContent=out.join('\\n')+'\\nBROWSER_UI_PASS';}catch(e){document.querySelector('#result').textContent='BROWSER_UI_FAIL '+e;}})();
</script>`;

const server = http.createServer((req, res) => {
  const request = decodeURIComponent((req.url || "/").split("?")[0]);
  if (request === "/__harness.html") { res.writeHead(200, {"content-type":"text/html"}); return res.end(harness); }
  const target = path.resolve(root, `.${request}`);
  if (!target.startsWith(root) || !fs.existsSync(target) || !fs.statSync(target).isFile()) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, {"content-type": mime[path.extname(target)] || "application/octet-stream"});
  fs.createReadStream(target).pipe(res);
});

server.on("error", error => {
  // Some hermetic runners prohibit even loopback sockets. Keep the browser
  // test available for CI/desktop runs without making such sandboxes look
  // like a scientific regression failure.
  if (error.code === "EPERM" || error.code === "EACCES") {
    console.warn(`SKIP: browser UI test cannot bind localhost in this runner (${error.code})`);
    process.exit(0);
  }
  throw error;
});
server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  const chromium = process.env.CHROMIUM || "/usr/bin/chromium-browser";
  const result = spawnSync(chromium, ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--user-data-dir=/tmp/ssz-portal-ui-test", "--virtual-time-budget=15000", "--dump-dom", `http://127.0.0.1:${port}/__harness.html`], {encoding:"utf8", timeout:45000});
  server.close();
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  if (result.error) throw result.error;
  if (result.status !== 0 || !output.includes("BROWSER_UI_PASS")) {
    console.error(output.slice(-6000));
    process.exit(1);
  }
  console.log(output.match(/[^<]*BROWSER_UI_PASS[^<]*/)?.[0] || "BROWSER_UI_PASS");
});
