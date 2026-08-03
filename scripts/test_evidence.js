#!/usr/bin/env node
/** Verify that every Claim-ID formula reference resolves to rendered mathematics. */
const fs=require("fs"),path=require("path"),root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const page=read("evidence.html"),js=read("assets/js/evidence.js");
const ledger=JSON.parse(read("data/evidence-ledger.json"));
const formulas=JSON.parse(read("data/formulas.json")).formulas;
const ids=new Set(formulas.map(x=>x.id));
const aliases={"SSZ-FORM-XI-STRONG":"xi-strong","SSZ-FORM-BLEND-H5":"blend","SSZ-FORM-XI-WEAK":"xi-weak","SSZ-FORM-D":"d","SSZ-FORM-METRIC":"metric","SSZ-FORM-CENTRE-A":"centre-a","SSZ-FORM-CENTRE-R":"ricci","SSZ-FORM-CENTRE-K":"kretschmann","SSZ-FORM-NULL-POTENTIAL":"null-potential","SSZ-FORM-L2":"angular-momentum"};
const refs=ledger.claims.flatMap(x=>x.formula_ids);
const missing=refs.filter(id=>!ids.has(aliases[id]||id));
if(missing.length)throw new Error(`unresolved Claim formula IDs: ${[...new Set(missing)].join(", ")}`);
if(!page.includes("assets/vendor/mathjax/tex-svg.js"))throw new Error("Evidence page lacks local MathJax");
if(!js.includes("window.MathJax?.typesetPromise"))throw new Error("Evidence cards are not dynamically typeset");
console.log(`evidence rendering OK: ${ledger.claims.length} claims, ${refs.length} references, ${new Set(refs).size} formula IDs`);
