(() => {
  "use strict";
  const $=id=>document.getElementById(id), n=id=>Number($(id).value), esc=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])), PHI=(1+Math.sqrt(5))/2;
  const strong=x=>1-Math.exp(-PHI/x),weak=x=>1/(2*x),sd=x=>-PHI*Math.exp(-PHI/x)/x**2,sdd=x=>Math.exp(-PHI/x)*(2*PHI/x**3-PHI**2/x**4),wd=x=>-1/(2*x**2),wdd=x=>1/x**3;
  const derivative=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h),second=(f,x,h=2e-4)=>(f(x+h)-2*f(x)+f(x-h))/h**2;
  function canvas(id,height=470){const el=$(id),d=Math.min(devicePixelRatio||1,2),w=Math.max(360,el.clientWidth),h=Math.max(height,el.clientHeight||height);el.width=w*d;el.height=h*d;const c=el.getContext("2d");c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);const s=getComputedStyle(document.documentElement);return{el,c,w,h,text:s.getPropertyValue("--text").trim(),muted:s.getPropertyValue("--muted").trim(),line:s.getPropertyValue("--line").trim(),gold:s.getPropertyValue("--gold").trim()};}
  const download=(name,data)=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download=name;a.click();URL.revokeObjectURL(a.href);};

  let blendState;
  function blend(){
    let x0=n("blend-x0"),x1=n("blend-x1");if(x1<=x0+.08)x1=x0+.08;
    const eps=n("blend-epsilon"),y0=strong(x0)+n("blend-y0"),y1=weak(x1)+n("blend-y1"),d0=sd(x0)+n("blend-d0"),d1=wd(x1)+n("blend-d1"),dd0=sdd(x0)+n("blend-dd0"),dd1=wdd(x1)+n("blend-dd1"),h=x1-x0;
    const a0=y0,a1=h*d0,a2=h*h*dd0/2,A=y1-a0-a1-a2,B=h*d1-a1-2*a2,Q=h*h*dd1-2*a2,a3=10*A-4*B+Q/2,a4=-15*A+7*B-Q,a5=6*A-3*B+Q/2;
    const H=x=>{const t=(x-x0)/h;return a0+a1*t+a2*t*t+a3*t**3+a4*t**4+a5*t**5+eps*t**3*(1-t)**3;},xi=x=>x<x0?strong(x):x>x1?weak(x):H(x),metric=x=>1/(1+xi(x))**2,potential=x=>metric(x)/x**2,L2=x=>{const a=metric(x),ap=derivative(metric,x,2e-5);return x**3*ap/(2*a-x*ap);};
    const roots=(fn,lo,hi)=>{const out=[];let px=lo,pv=fn(lo);for(let i=1;i<=1000;i++){const x=lo+(hi-lo)*i/1000,v=fn(x);if(Number.isFinite(v)&&Number.isFinite(pv)&&v*pv<0){let a=px,b=x;for(let j=0;j<60;j++){const m=(a+b)/2;if(fn(a)*fn(m)<=0)b=m;else a=m;}out.push((a+b)/2);}px=x;pv=v;}return out;};
    const nullRoots=roots(x=>derivative(potential,x,2e-5),Math.max(.2,x0-.25),x1+.25),photon=nullRoots.find(x=>second(potential,x)<0),timelike=photon?roots(x=>derivative(L2,x,5e-5),photon+.001,x1+.8).find(x=>second(L2,x,4e-4)>0):null;
    const residual=Math.max(Math.abs(H(x0)-y0),Math.abs(H(x1)-y1),Math.abs(derivative(H,x0)-d0),Math.abs(derivative(H,x1)-d1),Math.abs(second(H,x0)-dd0),Math.abs(second(H,x1)-dd1));
    return{x0,x1,eps,H,xi,metric,potential,L2,photon,timelike,impact:photon?photon/Math.sqrt(metric(photon)):null,residual,offsets:[n("blend-y0"),n("blend-d0"),n("blend-dd0"),n("blend-y1"),n("blend-d1"),n("blend-dd1")]};
  }
  function drawBlend(s){
    const {c,w,h,text,muted,line,gold}=canvas("blend-lab-canvas"),L=60,R=w-22,T=35,B=h-55,xmin=1.3,xmax=2.8,xp=x=>L+(x-xmin)/(xmax-xmin)*(R-L),yp=y=>B-y/.5*(B-T);
    c.strokeStyle=line;c.beginPath();c.moveTo(L,T);c.lineTo(L,B);c.lineTo(R,B);c.stroke();c.fillStyle="#7c3aed22";c.fillRect(xp(s.x0),T,xp(s.x1)-xp(s.x0),B-T);
    [{f:s.potential,col:gold,name:"A/x²"},{f:x=>Math.max(0,Math.min(.5,s.L2(x)/30)),col:"#2563eb",name:"L²/30"}].forEach((row,k)=>{c.strokeStyle=row.col;c.lineWidth=2.5;c.beginPath();for(let i=0;i<=700;i++){const x=xmin+(xmax-xmin)*i/700,y=yp(row.f(x));i?c.lineTo(xp(x),y):c.moveTo(xp(x),y);}c.stroke();c.fillStyle=row.col;c.fillText(row.name,L+k*70,18);});
    [s.x0,s.x1].forEach(x=>{c.strokeStyle="#7c3aed";c.setLineDash([4,4]);c.beginPath();c.moveTo(xp(x),T);c.lineTo(xp(x),B);c.stroke();});c.setLineDash([]);
    if(s.photon){c.fillStyle="#b42318";c.beginPath();c.arc(xp(s.photon),yp(s.potential(s.photon)),7,0,Math.PI*2);c.fill();}if(s.timelike){c.fillStyle="#2563eb";c.beginPath();c.arc(xp(s.timelike),yp(Math.max(0,Math.min(.5,s.L2(s.timelike)/30))),7,0,Math.PI*2);c.fill();}
    c.fillStyle=muted;c.textAlign="center";c.fillText("normalised radius x=r/rₛ · shaded matching interval",w/2,h-18);
  }
  function updateBlend(){
    const s=blendState=blend();["x0","x1","epsilon","y0","d0","dd0","y1","d1","dd1"].forEach(id=>$(`blend-${id}-out`).textContent=n(`blend-${id}`).toFixed(3));
    $("blend-photon").textContent=s.photon?s.photon.toFixed(8):"none";$("blend-impact").textContent=s.impact?s.impact.toFixed(8):"none";$("blend-isco").textContent=s.timelike?s.timelike.toFixed(8):"none";const inside=x=>x&&x>=s.x0&&x<=s.x1;$("blend-class").textContent=inside(s.photon)||inside(s.timelike)?"blend-dependent":"outside blend";$("blend-residual").textContent=s.residual.toExponential(2);
    $("blend-warning").textContent=inside(s.photon)?"The null stationary candidate lies inside the matching interval. It probes the chosen completion and must not be labelled branch-intrinsic.":"No null stationary candidate is currently localized inside the selected matching interval.";drawBlend(s);
  }

  let trajectory=[],geoSweep=false;
  function integrate(){
    if(!window.SSZ||typeof window.SSZ.dilation!=="function"){$("geo-status").textContent="physics library unavailable";return;}
    const type=$("geo-type").value,r0=n("geo-r0"),E=n("geo-e"),L=n("geo-l"),step=n("geo-step"),mass=type==="timelike"?1:0;let r=r0,phi=0,t=0,tau=0,sign=-1,turns=0,maxResidual=0;trajectory=[];
    const A=r=>window.SSZ.dilation(Math.max(r,.03))**2,F=r=>E**2-A(r)*(mass+L**2/r**2);
    for(let i=0;i<10000&&r>.055&&r<35;i++){let f=F(r);if(f<0){sign*=-1;turns++;r+=sign*step;f=F(r);if(f<0)break;}const rd=sign*Math.sqrt(Math.max(0,f)),pd=L/r**2,td=E/A(r);maxResidual=Math.max(maxResidual,Math.abs(rd*rd-f));trajectory.push({lambda:i*step,properTime:type==="timelike"?tau:null,r,phi,t,x:r*Math.cos(phi),y:r*Math.sin(phi),constraint:rd*rd-f,turning:false});r+=rd*step;phi+=pd*step;t+=td*step;tau+=type==="timelike"?step:0;if(turns>8)break;}
    for(let i=1;i<trajectory.length-1;i++)if((trajectory[i].r-trajectory[i-1].r)*(trajectory[i+1].r-trajectory[i].r)<0)trajectory[i].turning=true;
    $("geo-points").textContent=trajectory.length;$("geo-turns").textContent=turns;$("geo-error").textContent=maxResidual.toExponential(2);$("geo-time").textContent=`t=${t.toFixed(4)}${type==="timelike"?` · τ=${tau.toFixed(4)}`:" · affine λ"}`;$("geo-status").textContent=trajectory.length>20?"integrated · constraint monitored":"invalid/domain exit";drawGeodesic();
  }
  function drawGeodesic(){
    const {c,w,h,text,muted,line,gold}=canvas("geodesic-canvas"),cx=w*.32,cy=h*.48,maxR=Math.max(3,...trajectory.map(p=>p.r)),scale=Math.min(w*.27,h*.39)/maxR;
    [1,1.8,2.2].forEach((r,i)=>{c.strokeStyle=i?"#7c3aed55":"#b4231855";c.beginPath();c.arc(cx,cy,r*scale,0,Math.PI*2);c.stroke();});c.strokeStyle=gold;c.lineWidth=2;c.beginPath();trajectory.forEach((p,i)=>i?c.lineTo(cx+p.x*scale,cy+p.y*scale):c.moveTo(cx+p.x*scale,cy+p.y*scale));c.stroke();trajectory.filter(p=>p.turning).forEach(p=>{c.fillStyle="#b42318";c.beginPath();c.arc(cx+p.x*scale,cy+p.y*scale,5,0,Math.PI*2);c.fill();});c.fillStyle=text;c.beginPath();c.arc(cx,cy,6,0,Math.PI*2);c.fill();
    const L=w*.61,R=w-20,T=42,B=h-55,E=n("geo-e"),ell=n("geo-l"),mass=$("geo-type").value==="timelike"?1:0,A=x=>window.SSZ.dilation(x)**2,V=x=>A(x)*(mass+ell**2/x**2),max=Math.max(E**2,2);c.strokeStyle=line;c.beginPath();c.moveTo(L,T);c.lineTo(L,B);c.lineTo(R,B);c.stroke();c.strokeStyle="#2563eb";c.beginPath();for(let i=0;i<=500;i++){const x=.1+20*i/500,y=B-V(x)/max*(B-T);i?c.lineTo(L+(R-L)*i/500,y):c.moveTo(L,y);}c.stroke();c.strokeStyle="#b42318";c.setLineDash([4,4]);c.beginPath();c.moveTo(L,B-E**2/max*(B-T));c.lineTo(R,B-E**2/max*(B-T));c.stroke();c.setLineDash([]);c.fillStyle=muted;c.textAlign="center";c.fillText(`trajectory · adaptive 0…${maxR.toFixed(1)} rₛ`,cx,h-16);c.fillText("effective potential V(r) and E²",L+(R-L)/2,h-16);c.textAlign="left";c.fillText("red dots: radial turning points",24,24);
  }

  async function independence(){
    const data=await fetch("data/test-independence.json").then(r=>r.json());$("ind-records").textContent=data.record_count.toLocaleString();$("ind-repos").textContent=data.repository_count;$("ind-categories").textContent=data.category_count;
    const {c,w,h,text,muted,line,gold}=canvas("independence-canvas",420),cx=w/2,cy=h/2,r=Math.min(w,h)*.34,total=data.groups.reduce((s,g)=>s+g.records,0);let angle=-Math.PI/2;
    data.groups.forEach((g,i)=>{const span=2*Math.PI*g.records/total,mid=angle+span/2,x=cx+r*Math.cos(mid),y=cy+r*Math.sin(mid);c.strokeStyle=line;c.beginPath();c.moveTo(cx,cy);c.lineTo(x,y);c.stroke();c.fillStyle=i%2?gold:"#2563eb";c.beginPath();c.arc(x,y,Math.max(8,Math.sqrt(g.records)*.32),0,Math.PI*2);c.fill();c.fillStyle=text;c.textAlign="center";c.fillText(g.name.slice(0,24),x,y+25);angle+=span;});c.fillStyle=muted;c.fillText("shared catalogue origin",cx,cy);
    $("independence-table").innerHTML=`<table><thead><tr><th>Provenance group</th><th>Records</th><th>Repositories</th><th>Source files</th><th>Independence</th></tr></thead><tbody>${data.groups.map(g=>`<tr><td>${esc(g.name)}</td><td>${g.records}</td><td>${g.repositories}</td><td>${g.source_files}</td><td>${esc(g.independence_status)}</td></tr>`).join("")}</tbody></table>`;
  }
  let conflicts=[];
  function renderConflicts(){const q=$("conflict-search").value.toLowerCase(),sev=$("conflict-severity").value,rows=conflicts.filter(x=>(!sev||x.severity===sev)&&(!q||JSON.stringify(x).toLowerCase().includes(q)));$("conflict-atlas").innerHTML=`<div class="table-wrap"><table><thead><tr><th>Severity</th><th>Topic</th><th>Canonical replacement</th><th>Legacy conflict</th><th>Repository/file/line</th></tr></thead><tbody>${rows.map(x=>`<tr><td><span class="badge corrected">${esc(x.severity)}</span></td><td>${esc(x.topic)}</td><td>${esc(x.current)}</td><td>${esc(x.legacy)}</td><td>unresolved in normalized catalogue<br><small>${esc(x.resolution)}</small></td></tr>`).join("")}</tbody></table></div>`;}
  async function conflictAtlas(){const data=await fetch("data/conflicts.json").then(r=>r.json());conflicts=data.conflicts;[...new Set(conflicts.map(x=>x.severity))].forEach(x=>$("conflict-severity").insertAdjacentHTML("beforeend",`<option>${esc(x)}</option>`));$("conflict-search").addEventListener("input",renderConflicts);$("conflict-severity").addEventListener("change",renderConflicts);renderConflicts();}
  async function falsification(){
    const data=await fetch("data/observable-maturity.json").then(r=>r.json()),select=$("falsification-domain");data.domains.forEach((d,i)=>select.insertAdjacentHTML("beforeend",`<option value="${i}">${esc(d.domain)}</option>`));
    const render=()=>{const d=data.domains[select.value||0],stages=data.stage_order.map(key=>({key,status:d.stages[key]}));$("falsification-pipeline").innerHTML=stages.map(s=>`<div class="maturity-stage ${esc(s.status)}"><strong>${esc(s.key.replaceAll("_"," "))}</strong><span>${esc(s.status)}</span></div>`).join("");const ready=["forward_model","real_data","uncertainty_model","model_comparison"].every(k=>d.stages[k]==="complete");$("falsification-verdict").className=`callout ${ready?"tested":"warning"}`;$("falsification-verdict").innerHTML=`<strong>${ready?"Potentially decision-ready":"Not yet decision-ready"}:</strong> ${esc(d.audit_note)} ${ready?"A preregistered quantitative comparison is still required.":"No valid model-versus-uncertainty significance should be displayed until the missing stages are completed."}`;};select.addEventListener("change",render);render();
  }
  async function dimensions(){
    const data=await fetch("data/formulas.json").then(r=>r.json()),select=$("dimension-formula");data.formulas.forEach((f,i)=>select.insertAdjacentHTML("beforeend",`<option value="${i}">${esc(f.id)} · ${esc(f.name)}</option>`));
    const chains={rs:["[G]=L³M⁻¹T⁻²","[M]=M","[c²]=L²T⁻²","[2GM/c²]=L"],x:["[r]=L","[rₛ]=L","[r/rₛ]=1"],phi:["numbers and square roots are dimensionless","[φ]=1"]};
    const render=()=>{const f=data.formulas[select.value||0],chain=chains[f.id]||[`declared output unit: ${f.units}`,"operation-level dimensional decomposition not yet normalized in the formula catalogue"]; $("dimension-card").innerHTML=`<span class="badge canonical">${esc(f.topic)}</span><h3>${esc(f.name)}</h3><div class="math-box">${esc(f.latex)}</div><ol>${chain.map(x=>`<li>${esc(x)}</li>`).join("")}</ol><p><strong>Domain:</strong> ${esc(f.domain)}</p><p><strong>Output unit:</strong> ${esc(f.units)}</p><p class="callout">${esc(f.caution)}</p>`;};select.addEventListener("change",render);render();
  }

  function solve3(m,b){for(let i=0;i<3;i++){let p=i;for(let j=i+1;j<3;j++)if(Math.abs(m[j][i])>Math.abs(m[p][i]))p=j;[m[i],m[p]]=[m[p],m[i]];[b[i],b[p]]=[b[p],b[i]];const q=m[i][i];for(let k=i;k<3;k++)m[i][k]/=q;b[i]/=q;for(let j=0;j<3;j++)if(j!==i){const f=m[j][i];for(let k=i;k<3;k++)m[j][k]-=f*m[i][k];b[j]-=f*b[i];}}return b;}
  let sandboxState;
  function sandbox(){
    const a0=n("sandbox-a0"),a2=n("sandbox-a2")/2,rm=n("sandbox-rm"),ext=x=>window.SSZ.dilation(x)**2,ym=ext(rm),dm=derivative(ext,rm),ddm=second(ext,rm),m=[[rm**3,rm**4,rm**5],[3*rm**2,4*rm**3,5*rm**4],[6*rm,12*rm**2,20*rm**3]],b=[ym-a0-a2*rm**2,dm-2*a2*rm,ddm-2*a2],[a3,a4,a5]=solve3(m,b),coef=[a0,0,a2,a3,a4,a5],A=x=>coef.reduce((s,a,i)=>s+a*x**i,0),dA=x=>coef.reduce((s,a,i)=>i?s+i*a*x**(i-1):s,0),ddA=x=>coef.reduce((s,a,i)=>i>1?s+i*(i-1)*a*x**(i-2):s,0),R=x=>-ddA(x)-4*dA(x)/x+2*(1-A(x))/x**2,K=x=>ddA(x)**2+(2*dA(x)/x)**2+(2*(1-A(x))/x**2)**2;
    return{a0,a2:a2*2,rm,coef,A,dA,ddA,R,K,match:[A(rm)-ym,dA(rm)-dm,ddA(rm)-ddm],minA:Math.min(...Array.from({length:301},(_,i)=>A(rm*i/300)))};
  }
  function updateSandbox(){
    const s=sandboxState=sandbox(),eps=1e-5,R=s.R(eps),K=s.K(eps),tol=1e-8,regular=Math.abs(s.a0-1)<1e-6,match=s.match.map(v=>Math.abs(v)<tol),signature=s.minA>0;
    $("sandbox-a0-out").textContent=s.a0.toFixed(3);$("sandbox-a2-out").textContent=s.a2.toFixed(3);$("sandbox-rm-out").textContent=s.rm.toFixed(3);$("sandbox-c0").textContent=Math.abs(s.match[0]).toExponential(2);$("sandbox-c1").textContent=Math.abs(s.match[1]).toExponential(2);$("sandbox-c2").textContent=Math.abs(s.match[2]).toExponential(2);$("sandbox-r").textContent=regular?R.toExponential(3):"diverges ~r⁻²";$("sandbox-k").textContent=regular?K.toExponential(3):"diverges ~r⁻⁴";$("sandbox-signature").textContent=s.minA>0?"Lorentzian sample":"signature failure";
    const checks=[
      ["A(0)=1 regular-centre necessity",regular,`A(0)=${s.a0.toFixed(3)}`],
      ["A′(0)=0 spherical-centre condition",Math.abs(s.dA(0))<tol,`A′(0)=${s.dA(0).toExponential(2)}`],
      ["Positive sampled A(r)",signature,`min A=${s.minA.toFixed(6)}`],
      ["C⁰ matching",match[0],`|ΔA|=${Math.abs(s.match[0]).toExponential(2)}`],
      ["C¹ matching",match[1],`|ΔA′|=${Math.abs(s.match[1]).toExponential(2)}`],
      ["C² matching",match[2],`|ΔA″|=${Math.abs(s.match[2]).toExponential(2)}`],
      ["Field-equation solution",null,"not available"],
      ["Energy conditions and matter model",null,"not evaluated"],
      ["Global causal/geodesic completeness",null,"not evaluated"]
    ];
    $("sandbox-checks").innerHTML=checks.map(([label,pass,detail])=>`<div class="maturity-stage ${pass===true?"complete":pass===false?"excluded":"open"}"><strong>${pass===true?"✓":pass===false?"✕":"?"} ${label}</strong><span>${detail}</span></div>`).join("");
    const localPass=regular&&signature&&match.every(Boolean);
    $("sandbox-verdict").className=`callout ${localPass?"tested":"warning"}`;
    $("sandbox-verdict").innerHTML=`<strong>${localPass?"Passes the displayed local necessary checks":"Fails at least one displayed local necessary check"}.</strong> ${regular?"A(0)=1 removes the leading areal-centre deficit term for this ansatz; finite sampled values are not a proof of all-order regularity.":"A(0)≠1 retains the leading r⁻² and r⁻⁴ curvature divergence."} C² matching is numerically audited at tolerance ${tol.toExponential(0)}. This result neither constructs nor validates a global SSZ interior.`;
    const {c,w,h,line,gold}=canvas("interior-sandbox-canvas"),L=64,Rp=w-20,T=32,B=h-52,samples=Array.from({length:601},(_,i)=>s.A(s.rm*i/600)),yMin=Math.min(0,...samples),yMax=Math.max(1,...samples),pad=Math.max(.05,(yMax-yMin)*.08),lo=yMin-pad,hi=yMax+pad,xp=x=>L+x/s.rm*(Rp-L),yp=y=>B-(y-lo)/(hi-lo)*(B-T);c.strokeStyle=line;c.beginPath();c.moveTo(L,T);c.lineTo(L,B);c.lineTo(Rp,B);c.stroke();c.fillStyle=line;c.font="12px sans-serif";c.fillText("A(r)",12,T+5);c.fillText("0",L-10,B+18);c.fillText(`rₘ=${s.rm.toFixed(2)} rₛ`,Rp-78,B+20);c.strokeStyle=gold;c.lineWidth=2.5;c.beginPath();samples.forEach((y,i)=>{const x=s.rm*i/600;i?c.lineTo(xp(x),yp(y)):c.moveTo(xp(x),yp(y));});c.stroke();c.strokeStyle="#2563eb";c.setLineDash([5,4]);c.beginPath();for(let i=0;i<=200;i++){const x=s.rm*(.7+.3*i/200),y=window.SSZ.dilation(x)**2;i?c.lineTo(xp(x),yp(y)):c.moveTo(xp(x),yp(y));}c.stroke();c.setLineDash([]);
  }
  function bind(){
    ["blend-x0","blend-x1","blend-epsilon","blend-y0","blend-d0","blend-dd0","blend-y1","blend-d1","blend-dd1"].forEach(id=>$(id).addEventListener("input",updateBlend));$("blend-reset").addEventListener("click",()=>{[["blend-x0",1.8],["blend-x1",2.2],["blend-epsilon",0],["blend-y0",0],["blend-d0",0],["blend-dd0",0],["blend-y1",0],["blend-d1",0],["blend-dd1",0]].forEach(([id,v])=>$(id).value=v);updateBlend();});$("blend-export").addEventListener("click",()=>download("ssz-blend-workbench.json",{parameters:{x0:blendState.x0,x1:blendState.x1,epsilon:blendState.eps,offsets:blendState.offsets},results:{photon:blendState.photon,impact:blendState.impact,timelike:blendState.timelike,residual:blendState.residual},limitation:"metric-level matching sensitivity"}));
    ["geo-type","geo-r0","geo-e","geo-l","geo-step"].forEach(id=>$(id).addEventListener("input",()=>{if(id!=="geo-type")$(`${id}-out`).textContent=n(id).toFixed(id==="geo-step"?4:id==="geo-r0"?2:3);integrate();}));$("geo-run").addEventListener("click",integrate);const sweep=document.createElement("button");sweep.className="button";sweep.textContent="Sweep trajectory";sweep.setAttribute("aria-pressed","false");sweep.addEventListener("click",()=>{geoSweep=!geoSweep;sweep.textContent=geoSweep?"Pause sweep":"Sweep trajectory";sweep.setAttribute("aria-pressed",String(geoSweep));});$("geo-run").insertAdjacentElement("afterend",sweep);const animateGeo=now=>{if(geoSweep){const slider=$("geo-r0");slider.value=(2.25+17.75*((now/7000)%1)).toFixed(2);$("geo-r0-out").textContent=n("geo-r0").toFixed(2);integrate();}requestAnimationFrame(animateGeo);};requestAnimationFrame(animateGeo);$("geo-export").addEventListener("click",()=>download("ssz-geodesic-trajectory.json",{parameters:{type:$("geo-type").value,r0:n("geo-r0"),E:n("geo-e"),L:n("geo-l"),step:n("geo-step")},trajectory,limitation:"geodesic of the declared static metric only"}));
    ["sandbox-a0","sandbox-a2","sandbox-rm"].forEach(id=>$(id).addEventListener("input",updateSandbox));$("sandbox-export").addEventListener("click",()=>download("ssz-hypothetical-interior.json",{parameters:{A0:sandboxState.a0,Asecond0:sandboxState.a2,matching_radius:sandboxState.rm},coefficients:sandboxState.coef,audit:{matching_residuals:sandboxState.match,min_sampled_A:sandboxState.minA,A_prime_0:sandboxState.dA(0),tolerance:1e-8},limitations:["hypothetical polynomial ansatz","necessary local checks only","no field equations","no energy-condition, stability, causal or global-completeness proof"]}));
    addEventListener("resize",()=>{drawBlend(blendState);drawGeodesic();updateSandbox();});updateBlend();integrate();updateSandbox();independence();conflictAtlas();falsification();dimensions();
  }
  document.addEventListener("DOMContentLoaded",bind);
})();
