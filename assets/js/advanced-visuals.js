(() => {
  "use strict";
  const C=299792458;
  const $=id=>document.getElementById(id);
  const val=id=>Number($(id)?.value);
  const put=(id,value)=>$(id)?.replaceChildren(document.createTextNode(String(value)));
  const fmt=(x,n=6)=>Number.isFinite(x)?x.toLocaleString("en-US",{maximumFractionDigits:n}):"—";
  const colour=name=>getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const xi=x=>window.SSZVisual.xi(Math.max(1e-6,x));
  const D=x=>window.SSZVisual.D(Math.max(1e-6,x));
  const derivative=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h);
  const second=(f,x,h=1e-4)=>(f(x+h)-2*f(x)+f(x-h))/(h*h);
  let time=0,last=performance.now(),running=!matchMedia("(prefers-reduced-motion: reduce)").matches;

  function surface(id){
    const canvas=$(id);if(!canvas)return null;
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.max(320,rect.width||700),h=Math.max(330,rect.height||430);
    const targetW=Math.round(w*dpr),targetH=Math.round(h*dpr);
    if(canvas.width!==targetW||canvas.height!==targetH){canvas.width=targetW;canvas.height=targetH;}
    const c=canvas.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
    return {c,w,h,a:{l:62,r:w-24,t:38,b:h-48}};
  }
  function axes(c,a,w,h,xLabel,yLabel){
    c.strokeStyle=colour("--line");c.lineWidth=1;c.beginPath();c.moveTo(a.l,a.t);c.lineTo(a.l,a.b);c.lineTo(a.r,a.b);c.stroke();
    c.fillStyle=colour("--muted");c.font="11px Inter";c.textAlign="center";c.fillText(xLabel,(a.l+a.r)/2,h-10);
    c.save();c.translate(15,(a.t+a.b)/2);c.rotate(-Math.PI/2);c.fillText(yLabel,0,0);c.restore();
  }
  function curve(c,values,xp,yp,stroke,width=2.5,dash=[]){
    c.save();c.strokeStyle=stroke;c.lineWidth=width;c.setLineDash(dash);c.beginPath();
    values.forEach((p,i)=>i?c.lineTo(xp(p.x),yp(p.y)):c.moveTo(xp(p.x),yp(p.y)));c.stroke();c.restore();
  }

  function drawContinuity(){
    const s=surface("continuity-canvas");if(!s)return;const {c,w,h,a}=s,join=val("continuity-join"),windowSize=val("continuity-window");
    put("continuity-window-out",fmt(windowSize,2));
    const eps=1e-6,left=join-eps,right=join+eps,d0=xi(right)-xi(left),d1=derivative(xi,right)-derivative(xi,left),d2=second(xi,right)-second(xi,left);
    put("continuity-d0",d0.toExponential(2));put("continuity-d1",d1.toExponential(2));put("continuity-d2",d2.toExponential(2));
    put("continuity-status",Math.max(Math.abs(d0),Math.abs(d1),Math.abs(d2))<1e-3?"consistent at probe resolution":"inspect tolerance");
    const min=join-windowSize,max=join+windowSize,xs=Array.from({length:500},(_,i)=>min+(max-min)*i/499);
    const series=[
      {name:"Ξ",data:xs.map(x=>({x,y:xi(x)})),color:colour("--gold")},
      {name:"Ξ′",data:xs.map(x=>({x,y:derivative(xi,x,2e-5)})),color:"#2563eb"},
      {name:"Ξ″",data:xs.map(x=>({x,y:second(xi,x,2e-4)})),color:"#7c3aed"}
    ];
    const all=series.flatMap(v=>v.data.map(p=>p.y)),lo=Math.min(...all),hi=Math.max(...all),xp=x=>a.l+(x-min)/(max-min)*(a.r-a.l),yp=y=>a.b-(y-lo)/(hi-lo||1)*(a.b-a.t);
    axes(c,a,w,h,"normalized radius x","value / derivatives");
    series.forEach((item,index)=>{curve(c,item.data,xp,yp,item.color,2.2,index?[6,3]:[]);c.fillStyle=item.color;c.fillText(item.name,a.l+22+index*48,20);});
    c.strokeStyle="#b42318";c.setLineDash([4,4]);c.beginPath();c.moveTo(xp(join),a.t);c.lineTo(xp(join),a.b);c.stroke();c.setLineDash([]);
  }
  function drawComponents(){
    const s=surface("components-canvas");if(!s)return;
    const {c,w,h,a}=s,xProbe=val("component-radius"),theta=val("component-theta");
    const form=$("component-form")?.value||"diagonal",log=Boolean($("component-log")?.checked),inverse=Boolean($("component-inverse")?.checked);
    const density=xi(xProbe),d=D(xProbe),stretch=1/d,A=d*d,B=1/A,beta=Math.sqrt(Math.max(0,1-A));
    const gtt=form==="diagonal"?-A:-(1-beta*beta),grr=form==="diagonal"?B:1,gtr=form==="diagonal"?0:beta;
    const nullSlope=form==="diagonal"?`±${fmt(A,6)}`:`${fmt(1-beta,6)} / ${fmt(-1-beta,6)}`;
    put("component-radius-out",fmt(xProbe,2));put("component-theta-out",`${fmt(theta,0)}°`);
    put("component-xi",`${fmt(density,8)} · ${window.SSZ.branch(xProbe)}`);put("component-ds",fmt(d*stretch,12));
    put("component-gtt",fmt(gtt,9));put("component-grr",fmt(grr,9));put("component-gtr",fmt(gtr,9));
    put("component-signature","− + + +");put("component-det","−1.000000000");put("component-null",nullSlope);
    const min=.05,max=20,count=760,xs=Array.from({length:count},(_,i)=>{
      const u=i/(count-1);return log?min*(max/min)**u:min+(max-min)*u;
    });
    const series=form==="diagonal"
      ? (inverse
        ? [{name:"−gᵗᵗc² = D⁻²",colour:colour("--gold"),dash:[],values:xs.map(x=>({x,y:1/D(x)**2}))},
           {name:"gʳʳ = D²",colour:"#2563eb",dash:[7,4],values:xs.map(x=>({x,y:D(x)**2}))}]
        : [{name:"−gₜₜ/c² = D²",colour:colour("--gold"),dash:[],values:xs.map(x=>({x,y:D(x)**2}))},
           {name:"gᵣᵣ = D⁻²",colour:"#2563eb",dash:[7,4],values:xs.map(x=>({x,y:1/D(x)**2}))}])
      : (inverse
        ? [{name:"−gᵗᵗc² = 1",colour:colour("--gold"),dash:[],values:xs.map(x=>({x,y:1}))},
           {name:"gʳʳ = 1−β²",colour:"#2563eb",dash:[7,4],values:xs.map(x=>({x,y:D(x)**2}))},
           {name:"gᵗʳc = β",colour:"#7c3aed",dash:[3,3],values:xs.map(x=>({x,y:Math.sqrt(Math.max(0,1-D(x)**2))}))}]
        : [{name:"−gₜₜ/c² = 1−β²",colour:colour("--gold"),dash:[],values:xs.map(x=>({x,y:D(x)**2}))},
           {name:"gᵣᵣ = 1",colour:"#2563eb",dash:[7,4],values:xs.map(x=>({x,y:1}))},
           {name:"gₜᵣ/c = β",colour:"#7c3aed",dash:[3,3],values:xs.map(x=>({x,y:Math.sqrt(Math.max(0,1-D(x)**2))}))}]);
    const all=series.flatMap(item=>item.values.map(point=>point.y)),ymax=Math.max(...all)*1.08;
    const xp=x=>a.l+(log?Math.log(x/min)/Math.log(max/min):(x-min)/(max-min))*(a.r-a.l),yp=y=>a.b-y/ymax*(a.b-a.t);
    axes(c,a,w,h,log?"logarithmic x = r/rₛ":"x = r/rₛ",inverse?"normalised inverse component":"normalised metric component");
    series.forEach((item,index)=>{curve(c,item.values,xp,yp,item.colour,2.3,item.dash);c.fillStyle=item.colour;c.textAlign="left";c.fillText(item.name,a.l+index*150,20);});
    [1,1.8,2.2].forEach((boundary,index)=>{c.strokeStyle=index?"#7c3aed":"#b42318";c.setLineDash([3,3]);c.beginPath();c.moveTo(xp(boundary),a.t);c.lineTo(xp(boundary),a.b);c.stroke();});
    c.strokeStyle="#111827";c.setLineDash([]);c.beginPath();c.moveTo(xp(xProbe),a.t);c.lineTo(xp(xProbe),a.b);c.stroke();
  }
  function clock(c,x,y,r,phase,label,stroke){
    c.strokeStyle=stroke;c.lineWidth=4;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();
    for(let i=0;i<12;i++){const a=i*Math.PI/6;c.beginPath();c.moveTo(x+Math.cos(a)*r*.82,y+Math.sin(a)*r*.82);c.lineTo(x+Math.cos(a)*r*.94,y+Math.sin(a)*r*.94);c.stroke();}
    c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(phase)*r*.62,y-Math.cos(phase)*r*.62);c.stroke();
    c.fillStyle=colour("--text");c.textAlign="center";c.font="700 13px Inter";c.fillText(label,x,y+r+25);
  }
  function drawClocks(){
    const s=surface("clocks-canvas");if(!s)return;const {c,w,h}=s,inner=val("clock-inner"),outer=val("clock-outer"),di=D(inner),dout=D(outer),ratio=di/dout,z=dout/di-1;
    put("clock-inner-out",fmt(inner,2));put("clock-outer-out",fmt(outer,2));put("clock-di",fmt(di,9));put("clock-do",fmt(dout,9));put("clock-ratio",fmt(ratio,9));put("clock-z",fmt(z,9));
    const r=Math.min(w*.16,h*.25);clock(c,w*.29,h*.46,r,time*di*2.4,`inner · ${fmt(di,4)} τ/t`,colour("--gold"));clock(c,w*.71,h*.46,r,time*dout*2.4,`outer · ${fmt(dout,4)} τ/t`,"#2563eb");
    c.strokeStyle=colour("--line");c.setLineDash([6,5]);c.beginPath();c.moveTo(w*.29+r,h*.46);c.lineTo(w*.71-r,h*.46);c.stroke();c.setLineDash([]);
    c.fillStyle=colour("--muted");c.textAlign="center";c.fillText("same coordinate-time interval",w/2,h*.46-14);
  }
  function wavelengthColour(nm){
    const n=Math.max(380,Math.min(750,nm));let r=0,g=0,b=0;
    if(n<440){r=-(n-440)/60;b=1}else if(n<490){g=(n-440)/50;b=1}else if(n<510){g=1;b=-(n-510)/20}else if(n<580){r=(n-510)/70;g=1}else if(n<645){r=1;g=-(n-645)/65}else r=1;
    return `rgb(${r*255|0} ${g*255|0} ${b*255|0})`;
  }
  function drawSpectrum(){
    const s=surface("spectrum-canvas");if(!s)return;const {c,w,h,a}=s,rest=val("spectrum-line"),em=val("spectrum-emitter"),ob=val("spectrum-observer"),z=D(ob)/D(em)-1,observed=rest*(1+z);
    put("spectrum-line-out",`${fmt(rest,2)} nm`);put("spectrum-emitter-out",fmt(em,2));put("spectrum-observer-out",fmt(ob,2));put("spectrum-z",fmt(z,9));put("spectrum-observed",`${fmt(observed,3)} nm`);
    const grad=c.createLinearGradient(a.l,0,a.r,0);[[380,"#5b21b6"],[440,"#2563eb"],[490,"#06b6d4"],[510,"#16a34a"],[580,"#eab308"],[645,"#ef4444"],[750,"#7f1d1d"]].forEach(([n,col])=>grad.addColorStop((n-380)/370,col));
    c.fillStyle=grad;c.fillRect(a.l,h*.34,a.r-a.l,70);const xp=nm=>a.l+(nm-380)/370*(a.r-a.l);
    [[rest,colour("--text"),"emitted"],[observed,colour("--gold"),"observed"]].forEach(([nm,col,label])=>{const x=xp(Math.max(380,Math.min(750,nm)));c.strokeStyle=col;c.lineWidth=5;c.beginPath();c.moveTo(x,h*.27);c.lineTo(x,h*.62);c.stroke();c.fillStyle=col;c.textAlign="center";c.fillText(`${label} ${fmt(nm,1)} nm`,x,h*.69);});
    c.fillStyle=wavelengthColour(observed);c.beginPath();c.arc(w/2,h*.82,20,0,Math.PI*2);c.fill();
  }
  function integrateNull(start,end){
    const lo=Math.min(start,end),hi=Math.max(start,end),steps=2500,dx=(hi-lo)/steps;let integral=0;
    for(let i=0;i<steps;i++){const x=lo+(i+.5)*dx;integral+=dx/(D(x)**2);}
    return integral;
  }
  function drawNull(){
    const s=surface("null-canvas");if(!s)return;const {c,w,h,a}=s,start=val("null-start"),end=val("null-end"),lo=Math.min(start,end),hi=Math.max(start,end),travel=integrateNull(start,end),flat=hi-lo;
    put("null-start-out",fmt(start,2));put("null-end-out",fmt(end,2));put("null-time",`${fmt(travel,6)} rₛ/c`);put("null-flat",`${fmt(flat,6)} rₛ/c`);
    const xs=Array.from({length:500},(_,i)=>lo+(hi-lo)*i/499);let accum=0,points=[{x:lo,y:0}];
    for(let i=1;i<xs.length;i++){const dx=xs[i]-xs[i-1],mid=(xs[i]+xs[i-1])/2;accum+=dx/(D(mid)**2);points.push({x:xs[i],y:accum});}
    const xp=x=>a.l+(x-lo)/(hi-lo||1)*(a.r-a.l),yp=y=>a.b-y/(travel||1)*(a.b-a.t);axes(c,a,w,h,"normalized radius x","coordinate time t c/rₛ");
    curve(c,points,xp,yp,colour("--gold"));curve(c,[{x:lo,y:0},{x:hi,y:flat}],xp,yp,"#2563eb",2,[7,4]);
    const u=(time*.12)%1,index=Math.min(points.length-1,Math.floor(u*points.length)),p=points[index];c.fillStyle=colour("--gold");c.beginPath();c.arc(xp(p.x),yp(p.y),6,0,Math.PI*2);c.fill();
  }
  const draws=[drawContinuity,drawComponents,drawClocks,drawSpectrum,drawNull];
  function drawAll(){draws.forEach(draw=>draw());}
  function frame(now){if(running&&!document.hidden)time+=Math.min((now-last)/1000,.05);last=now;drawAll();requestAnimationFrame(frame);}
  document.addEventListener("DOMContentLoaded",()=>{
    ["continuity-join","continuity-window","component-radius","component-theta","component-form","component-log","component-inverse","clock-inner","clock-outer","spectrum-line","spectrum-emitter","spectrum-observer","null-start","null-end"].forEach(id=>$(id)?.addEventListener("input",drawAll));
    addEventListener("resize",drawAll);addEventListener("ssz-theme-change",drawAll);addEventListener("ssz-animation-change",event=>{running=Boolean(event.detail?.running);});requestAnimationFrame(frame);
  });
})();
