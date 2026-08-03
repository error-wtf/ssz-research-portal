(() => {
  "use strict";
  const PHI=(1+Math.sqrt(5))/2, C=299792458;
  const strong=x=>1-Math.exp(-PHI/x);
  const weak=x=>1/(2*x);
  const sp=x=>-PHI*Math.exp(-PHI/x)/x**2;
  const spp=x=>Math.exp(-PHI/x)*(2*PHI/x**3-PHI**2/x**4);
  const wp=x=>-1/(2*x*x), wpp=x=>1/x**3;
  function hermite(t,y0,d0,dd0,y1,d1,dd1,w){
    const a0=y0,a1=w*d0,a2=w*w*dd0/2,A=y1-a0-a1-a2,B=w*d1-a1-2*a2,Q=w*w*dd1-2*a2;
    return a0+a1*t+a2*t*t+(10*A-4*B+Q/2)*t**3+(-15*A+7*B-Q)*t**4+(6*A-3*B+Q/2)*t**5;
  }
  const xi=x=>x<1.8?strong(x):x>2.2?weak(x):hermite((x-1.8)/.4,strong(1.8),sp(1.8),spp(1.8),weak(2.2),wp(2.2),wpp(2.2),.4);
  const D=x=>1/(1+xi(x));
  const regime=x=>x<1.8?"strong":x>2.2?"weak":"C² bridge";
  const val=id=>Number(document.getElementById(id)?.value);
  const put=(id,value)=>document.getElementById(id)?.replaceChildren(document.createTextNode(value));
  const fmt=(x,n=4)=>x.toLocaleString("en-US",{maximumFractionDigits:n});
  const colour=name=>getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const reduce=matchMedia("(prefers-reduced-motion: reduce)");
  let running=!reduce.matches, time=0, last=performance.now();

  function surface(canvas) {
    const rect=canvas.getBoundingClientRect(), dpr=Math.min(devicePixelRatio||1,2);
    const w=Math.max(320,rect.width||700),h=Math.max(300,rect.height||420);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    const c=canvas.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
    return {c,w,h,text:colour("--text"),muted:colour("--muted"),line:colour("--line"),gold:colour("--gold"),surface:colour("--surface")};
  }
  function label(c,text,x,y,align="left",fill=colour("--text"),size=13){c.fillStyle=fill;c.font=`600 ${size}px Inter, sans-serif`;c.textAlign=align;c.fillText(text,x,y);}
  function ring(c,x,y,r,stroke,width=1,dash=[]){c.save();c.strokeStyle=stroke;c.lineWidth=width;c.setLineDash(dash);c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();c.restore();}

  function drawPhi(){
    const canvas=document.getElementById("phi-canvas");if(!canvas)return;
    const {c,w,h,text,muted,line,gold}=surface(canvas),lambda=val("phi-lambda"),levels=val("phi-levels");
    put("phi-lambda-out",fmt(lambda,3));put("phi-levels-out",levels);
    const cx=w/2,cy=h*.52,maxR=Math.min(w,h)*.42,ratios=Array.from({length:levels},(_,n)=>Math.exp(lambda*n));
    const scale=maxR/ratios.at(-1);
    ratios.forEach((r,n)=>{
      const radius=Math.max(3,r*scale),alpha=.18+.7*n/(levels-1);
      c.strokeStyle=`color-mix(in srgb, ${gold} ${Math.round(alpha*100)}%, transparent)`; // ignored gracefully in old canvas
      ring(c,cx,cy,radius,n===levels-1?gold:line,n===levels-1?2:1);
      const angle=time*.15+n*2.399963;
      c.fillStyle=n%2?gold:"#2563eb";c.beginPath();c.arc(cx+Math.cos(angle)*radius,cy+Math.sin(angle)*radius,3.2,0,Math.PI*2);c.fill();
    });
    c.strokeStyle=gold;c.lineWidth=2;c.beginPath();c.moveTo(cx-maxR*.85,cy+maxR*.62);c.lineTo(cx,cy-maxR*.9);c.lineTo(cx+maxR*.85,cy+maxR*.62);c.closePath();c.stroke();
    label(c,`λ = ${fmt(lambda,4)}${Math.abs(lambda-Math.log(PHI))<.003?" ≈ ln φ":""}`,18,25,"left",text,14);
    label(c,`r${levels-1}/r₀ = ${fmt(ratios.at(-1),2)}`,w-18,25,"right",muted,12);
    label(c,"conceptual exponential levels",cx,h-15,"center",muted,12);
  }
  function drawRadial(){
    const canvas=document.getElementById("radial-canvas");if(!canvas)return;
    const {c,w,h,text,muted,line,gold}=surface(canvas),x=val("radial-probe"),density=xi(x),d=D(x),s=1/d;
    put("radial-probe-out",fmt(x,2));put("radial-xi",fmt(density,8));put("radial-d",fmt(d,8));put("radial-s",fmt(s,6));put("radial-regime",regime(x));
    const cx=w*.52,cy=h*.53,maxR=Math.min(w,h)*.39;
    [1,1.8,2.2,4,8].forEach(radius=>{
      if(radius>8)return;ring(c,cx,cy,Math.sqrt(radius/8)*maxR,radius===1?"#b42318":radius===1.8||radius===2.2?"#7c3aed":line,radius===1?2:1,radius===1.8||radius===2.2?[5,4]:[]);
    });
    const pr=Math.sqrt(x/8)*maxR;ring(c,cx,cy,pr,gold,4);
    for(let i=0;i<9;i++){const a=i*Math.PI*2/9+time*.08;const r0=15,r1=pr;c.strokeStyle=gold;c.globalAlpha=.25+.5*i/9;c.beginPath();c.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);c.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);c.stroke();}c.globalAlpha=1;
    c.fillStyle=text;c.beginPath();c.arc(cx,cy,7,0,Math.PI*2);c.fill();
    label(c,"rₛ",cx+Math.sqrt(1/8)*maxR+6,cy-6,"left","#b42318");label(c,`${fmt(x,2)} rₛ`,cx+pr+7,cy+17,"left",gold);
    label(c,`proper radial scale s = ${fmt(s,4)}`,18,25,"left",text,14);label(c,"circle area remains 4πr²",18,h-17,"left",muted,12);
  }
  function drawLensing(){
    const canvas=document.getElementById("lensing-canvas");if(!canvas)return;const {c,w,h,text,muted,line,gold}=surface(canvas),b=val("impact"),alpha=2/b;
    put("impact-out",fmt(b,1));put("alpha-out",`${fmt(alpha,6)} rad (${fmt(alpha*180/Math.PI,4)}°)`);
    const cx=w/2,cy=h/2,displayB=(b-3)/27*h*.3+h*.09,bend=Math.min(h*.25,alpha*h*1.5);
    c.fillStyle=text;c.beginPath();c.arc(cx,cy,18,0,Math.PI*2);c.fill();for(let i=1;i<=3;i++)ring(c,cx,cy,18+i*12,line,1,[3,4]);
    c.strokeStyle=gold;c.lineWidth=3;c.beginPath();c.moveTo(0,cy-displayB);c.quadraticCurveTo(cx,cy-displayB+bend,w,cy-displayB+2*bend);c.stroke();
    const pulse=(time*.22%1)*w,py=(pulse<cx)?cy-displayB:cy-displayB+2*bend*((pulse-cx)/(w-cx))**1.4;c.fillStyle="#2563eb";c.beginPath();c.arc(pulse,py,6,0,Math.PI*2);c.fill();
    c.strokeStyle=muted;c.setLineDash([4,4]);c.beginPath();c.moveTo(cx,cy);c.lineTo(cx,cy-displayB);c.stroke();c.setLineDash([]);
    label(c,`b = ${fmt(b,1)} rₛ`,cx+8,cy-displayB/2,"left",muted);label(c,"scaled teaching geometry · not strong-field ray tracing",w/2,h-16,"center",muted,12);
  }
  function drawPotential(){
    const canvas=document.getElementById("potential-canvas");if(!canvas)return;
    const {c,w,h,text,muted,line,gold}=surface(canvas),max=val("potential-max"),min=.35,area={l:62,r:w-24,t:40,b:h-52};
    put("potential-max-out",fmt(max,0));
    const points=700,xs=Array.from({length:points},(_,i)=>min+(max-min)*i/(points-1));
    const ssz=xs.map(x=>D(x)**2/x**2),gr=xs.map(x=>x>1?(1-1/x)/x**2:null);
    const peakIndex=ssz.reduce((best,value,i)=>value>ssz[best]?i:best,0),peakX=xs[peakIndex],ymax=Math.max(...ssz,...gr.filter(Number.isFinite))*1.08;
    put("potential-peak",`${fmt(peakX,5)} rₛ`);
    const xp=x=>area.l+(x-min)/(max-min)*(area.r-area.l),yp=y=>area.b-y/ymax*(area.b-area.t);
    for(let i=0;i<=5;i++){const py=area.t+i*(area.b-area.t)/5;c.strokeStyle=line;c.beginPath();c.moveTo(area.l,py);c.lineTo(area.r,py);c.stroke();label(c,fmt(ymax*(5-i)/5,3),area.l-8,py+4,"right",muted,11);}
    const curve=(data,stroke,dashed=false)=>{c.save();c.strokeStyle=stroke;c.lineWidth=2.5;c.setLineDash(dashed?[7,5]:[]);c.beginPath();let active=false;data.forEach((y,i)=>{if(!Number.isFinite(y)){active=false;return;}active?c.lineTo(xp(xs[i]),yp(y)):c.moveTo(xp(xs[i]),yp(y));active=true;});c.stroke();c.restore();};
    curve(gr,"#2563eb",true);curve(ssz,gold);
    c.fillStyle=gold;c.beginPath();c.arc(xp(peakX),yp(ssz[peakIndex]),5,0,Math.PI*2);c.fill();
    label(c,"SSZ A/r²",area.l,20,"left",gold);label(c,"Schwarzschild reference",area.r,20,"right","#2563eb");
    label(c,"normalized radius r/rₛ",(area.l+area.r)/2,h-12,"center",text);
  }
  let observations=[], plottedObservations=[];
  function drawStarmap(){
    const canvas=document.getElementById("starmap-canvas");if(!canvas)return;
    const {c,w,h,text,muted,line,gold}=surface(canvas),limit=val("starmap-limit")||120,facility=document.getElementById("starmap-facility")?.value||"";
    put("starmap-limit-out",limit);put("starmap-loaded",observations.length||"loading");
    const area={l:58,r:w-24,t:38,b:h-52};
    for(let ra=0;ra<=360;ra+=60){const x=area.l+(360-ra)/360*(area.r-area.l);c.strokeStyle=line;c.beginPath();c.moveTo(x,area.t);c.lineTo(x,area.b);c.stroke();label(c,`${ra}°`,x,area.b+19,"center",muted,10);}
    for(let dec=-90;dec<=90;dec+=30){const y=area.b-(dec+90)/180*(area.b-area.t);c.strokeStyle=line;c.beginPath();c.moveTo(area.l,y);c.lineTo(area.r,y);c.stroke();label(c,`${dec}°`,area.l-7,y+4,"right",muted,10);}
    const filtered=observations.filter(item=>!facility||item.facility===facility).slice(0,limit);
    plottedObservations=filtered.map((item,index)=>({
      ...item,index,x:area.l+(360-item.ra_deg)/360*(area.r-area.l),y:area.b-(item.dec_deg+90)/180*(area.b-area.t)
    }));
    plottedObservations.forEach(item=>{c.fillStyle=item.facility==="JAO"?gold:"#2563eb";c.globalAlpha=.72;c.beginPath();c.arc(item.x,item.y,4,0,Math.PI*2);c.fill();});
    c.globalAlpha=1;label(c,"Right ascension (east ←)",(area.l+area.r)/2,h-10,"center",text,12);
    c.save();c.translate(15,(area.t+area.b)/2);c.rotate(-Math.PI/2);label(c,"Declination",0,0,"center",text,12);c.restore();
    label(c,observations.length?"catalogue observation fields":"loading catalogue…",area.l,22,"left",observations.length?gold:muted,13);
  }
  function drawSagnac(){
    const canvas=document.getElementById("sagnac-canvas");if(!canvas)return;const {c,w,h,text,muted,line,gold}=surface(canvas),omega=val("rotation-rate"),radiusM=val("loop-radius");
    put("rotation-rate-out",fmt(omega,2));put("loop-radius-out",fmt(radiusM,1));put("sagnac-out",(4*Math.PI*radiusM**2*omega/C**2).toExponential(5));
    const cx=w/2,cy=h*.48,r=Math.min(w,h)*.31,platform=time*omega,signal=time*1.5;
    ring(c,cx,cy,r,line,12);for(let i=0;i<8;i++){const a=platform+i*Math.PI/4;c.strokeStyle=muted;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);c.stroke();}
    const detector=platform-Math.PI/2;c.fillStyle=text;c.fillRect(cx+Math.cos(detector)*r-6,cy+Math.sin(detector)*r-6,12,12);
    [[signal,"#2563eb"],[-signal,gold]].forEach(([a,fill])=>{c.fillStyle=fill;c.beginPath();c.arc(cx+Math.cos(a-Math.PI/2)*r,cy+Math.sin(a-Math.PI/2)*r,7,0,Math.PI*2);c.fill();});
    label(c,"counter-clockwise",20,27,"left","#2563eb");label(c,"clockwise",w-20,27,"right",gold);label(c,"animation speeds are scaled",w/2,h-14,"center",muted,12);
  }
  function drawCurvature(){
    const canvas=document.getElementById("curvature-canvas");if(!canvas)return;const {c,w,h,text,muted,line,gold}=surface(canvas),minExp=val("curvature-min");
    put("curvature-min-out",String(minExp).replace("-", "−"));
    const area={l:65,r:w-25,t:38,b:h-55},xmap=e=>area.l+(e-minExp)/(-minExp)*(area.r-area.l),maxLog=Math.log10(9/4)-4*minExp,ymap=y=>area.b-y/maxLog*(area.b-area.t);
    for(let i=0;i<=5;i++){const x=area.l+i*(area.r-area.l)/5;c.strokeStyle=line;c.beginPath();c.moveTo(x,area.t);c.lineTo(x,area.b);c.stroke();label(c,fmt(minExp+(0-minExp)*i/5,1),x,area.b+20,"center",muted,11);}
    for(let i=0;i<=5;i++){const y=area.b-i*(area.b-area.t)/5;c.beginPath();c.moveTo(area.l,y);c.lineTo(area.r,y);c.stroke();label(c,fmt(maxLog*i/5,1),area.l-8,y+4,"right",muted,11);}
    const curve=(power,constant,stroke)=>{c.strokeStyle=stroke;c.lineWidth=3;c.beginPath();for(let i=0;i<=200;i++){const e=minExp+(0-minExp)*i/200,y=Math.log10(constant)-power*e,px=xmap(e),py=ymap(y);i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();};
    curve(2,1.5,"#2563eb");curve(4,2.25,gold);
    label(c,"log₁₀ R ~ log₁₀[3/(2r²)]",area.l,20,"left","#2563eb");label(c,"log₁₀ K ~ log₁₀[9/(4r⁴)]",area.r,20,"right",gold);
    label(c,"log₁₀(r/rₛ)",(area.l+area.r)/2,h-12,"center",text);c.save();c.translate(15,(area.t+area.b)/2);c.rotate(-Math.PI/2);label(c,"log₁₀ magnitude",0,0,"center",text);c.restore();
  }
  const draws=[drawPhi,drawRadial,drawLensing,drawPotential,drawStarmap,drawSagnac,drawCurvature];
  function drawAll(){draws.forEach(draw=>draw());}
  function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(running&&!document.hidden)time+=dt;drawAll();requestAnimationFrame(frame);}
  document.addEventListener("DOMContentLoaded",()=>{
    document.querySelectorAll(".visual-controls input").forEach(input=>input.addEventListener("input",drawAll));
    const button=document.getElementById("animation-toggle");button?.addEventListener("click",()=>{running=!running;button.textContent=running?"Pause animations":"Resume animations";});
    addEventListener("resize",drawAll);addEventListener("ssz-theme-change",drawAll);
    reduce.addEventListener?.("change",event=>{running=!event.matches;if(button)button.textContent=running?"Pause animations":"Resume animations";});
    fetch("data/observations.json").then(response=>response.json()).then(data=>{
      observations=data.objects||[];
      const select=document.getElementById("starmap-facility");
      [...new Set(observations.map(item=>item.facility))].sort().forEach(name=>{
        const option=document.createElement("option");option.value=name;option.textContent=name;select?.append(option);
      });
      select?.addEventListener("change",drawStarmap);drawStarmap();
    }).catch(()=>put("starmap-loaded","unavailable"));
    document.getElementById("starmap-canvas")?.addEventListener("click",event=>{
      const rect=event.currentTarget.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
      const nearest=plottedObservations.reduce((best,item)=>{
        const distance=Math.hypot(item.x-x,item.y-y);return !best||distance<best.distance?{item,distance}:best;
      },null);
      if(nearest&&nearest.distance<14)put("starmap-selected",`${nearest.item.target} · ${nearest.item.facility}`);
    });
    requestAnimationFrame(frame);
  });
  window.SSZVisual={PHI,strong,weak,xi,D,hermite};
})();
