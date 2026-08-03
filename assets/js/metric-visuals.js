(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let playing = !reduced, frame = 0, last = 0;
  const value = () => 10 ** Number($("metric-radius").value);
  const fmt = (v, d=6) => Number.isFinite(v) ? (Math.abs(v)>=1e4 || (Math.abs(v)<1e-4 && v!==0) ? v.toExponential(3) : v.toFixed(d)) : "—";
  function surface(canvas) {
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.max(320,rect.width||760),h=Math.max(300,rect.height||430);
    canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);
    const style=getComputedStyle(document.documentElement);return{c,w,h,bg:style.getPropertyValue("--surface").trim()||"#fff",ink:style.getPropertyValue("--deep").trim()||"#0f172a",muted:style.getPropertyValue("--muted").trim()||"#64748b",line:style.getPropertyValue("--line").trim()||"#dbe3ec",gold:style.getPropertyValue("--gold").trim()||"#b8860b"};
  }
  function axes(s,title,xlabel,ylabel) {
    const {c,w,h,bg,ink,line}=s;c.fillStyle=bg;c.fillRect(0,0,w,h);c.strokeStyle=line;c.lineWidth=1;c.beginPath();c.moveTo(62,30);c.lineTo(62,h-50);c.lineTo(w-20,h-50);c.stroke();c.fillStyle=ink;c.font="600 13px sans-serif";c.fillText(title,62,19);c.font="12px sans-serif";c.textAlign="center";c.fillText(xlabel,w/2,h-14);c.save();c.translate(17,h/2);c.rotate(-Math.PI/2);c.fillText(ylabel,0,0);c.restore();c.textAlign="left";
  }
  function geometry(x) {
    const s=surface($("metric-geometry")),{c,w,h,ink,muted,gold,line}=s,D=SSZ.dilation(x),A=D*D,B=1/A,cx=w*.58,cy=h*.52,scale=Math.min(w,h)*.29;
    c.fillStyle=s.bg;c.fillRect(0,0,w,h);c.strokeStyle=line;c.lineWidth=1;
    for(let i=-4;i<=4;i++){c.beginPath();c.moveTo(cx+i*scale/4,cy-scale);c.lineTo(cx+i*scale/4,cy+scale);c.stroke();c.beginPath();c.moveTo(cx-scale,cy+i*scale/4);c.lineTo(cx+scale,cy+i*scale/4);c.stroke();}
    const time=scale*Math.max(.2,D),radial=scale*Math.min(1.8,1/D);
    c.strokeStyle=gold;c.lineWidth=4;c.beginPath();c.moveTo(cx,cy-time);c.lineTo(cx,cy+time);c.stroke();
    c.strokeStyle="#2563eb";c.beginPath();c.moveTo(cx-radial,cy);c.lineTo(cx+radial,cy);c.stroke();
    const slope=Math.min(1.8,B);c.strokeStyle="#7c3aed";c.lineWidth=2;c.setLineDash([7,5]);c.beginPath();c.moveTo(cx-radial,cy-time);c.lineTo(cx+radial,cy+time);c.moveTo(cx-radial,cy+time);c.lineTo(cx+radial,cy-time);c.stroke();c.setLineDash([]);
    c.fillStyle=ink;c.font="600 13px sans-serif";c.fillText(`local static chart at x=${fmt(x,4)}`,18,28);c.font="12px sans-serif";c.fillStyle=gold;c.fillText(`time scale D=${fmt(D)}`,18,52);c.fillStyle="#2563eb";c.fillText(`radial scale √B=${fmt(Math.sqrt(B))}`,18,72);c.fillStyle=muted;c.fillText(`null coordinate slope diagnostic=${fmt(slope)}`,18,92);
  }
  function branches(x) {
    const s=surface($("metric-branches")),{c,w,h,ink,line,gold}=s;axes(s,"Ξ and its derivatives across the routing boundaries","x = r/rₛ (linear detail view)","scaled value");
    const L=62,R=w-20,T=35,B=h-50,x0=.55,x1=3.5,xp=q=>L+(q-x0)/(x1-x0)*(R-L),yp=q=>B-(q+1.2)/2.5*(B-T);
    c.fillStyle="rgba(124,58,237,.10)";c.fillRect(xp(1.8),T,xp(2.2)-xp(1.8),B-T);
    [1,1.8,2.2].forEach((q,i)=>{c.strokeStyle=i?"#7c3aed":"#b42318";c.setLineDash([4,4]);c.beginPath();c.moveTo(xp(q),T);c.lineTo(xp(q),B);c.stroke();c.setLineDash([]);c.fillStyle=ink;c.fillText(["rₛ","1.8","2.2"][i],xp(q)+3,B+17);});
    const draw=(fn,color,width=2)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();for(let i=0;i<=700;i++){const q=x0+(x1-x0)*i/700,y=fn(q);i?c.lineTo(xp(q),yp(y)):c.moveTo(xp(q),yp(y));}c.stroke();};
    draw(SSZ.xi,gold,3);draw(q=>SSZ.derivative(SSZ.xi,q),"#2563eb");draw(q=>SSZ.derivative(v=>SSZ.derivative(SSZ.xi,v),q),"#059669");
    if(x>=x0&&x<=x1){c.fillStyle="#b42318";c.beginPath();c.arc(xp(x),yp(SSZ.xi(x)),6,0,Math.PI*2);c.fill();}
    c.fillStyle=gold;c.fillText("Ξ",L+8,T+18);c.fillStyle="#2563eb";c.fillText("Ξ′",L+40,T+18);c.fillStyle="#059669";c.fillText("Ξ″",L+76,T+18);
  }
  function coefficients(x) {
    const s=surface($("metric-coefficients")),{c,w,h,ink,muted,gold,line}=s;axes(s,"Algebraic coefficient chain at the selected radius","quantity","value (log-height for B above 2)");
    const D=SSZ.dilation(x),vals=[SSZ.xi(x),D,D*D,1/(D*D),(D*D)/(D*D)],labels=["Ξ","D","A=D²","B=D⁻²","A·B"],colors=[gold,"#7c3aed","#2563eb","#059669","#b42318"],L=80,R=w-30,T=45,B=h-55,slot=(R-L)/vals.length;
    c.strokeStyle=line;for(let i=0;i<=4;i++){const y=B-(B-T)*i/4;c.beginPath();c.moveTo(62,y);c.lineTo(R,y);c.stroke();c.fillStyle=muted;c.fillText((i/2).toFixed(1),28,y+4);}
    vals.forEach((v,i)=>{const shown=Math.min(2,Math.log10(Math.max(1,v))*0.7+Math.min(v,1)),bar=Math.max(2,shown/2*(B-T));c.fillStyle=colors[i];c.fillRect(L+i*slot+slot*.2,B-bar,slot*.6,bar);c.fillStyle=ink;c.textAlign="center";c.fillText(labels[i],L+i*slot+slot*.5,B+20);c.fillText(fmt(v,5),L+i*slot+slot*.5,B-bar-8);});c.textAlign="left";
  }
  function limits(x) {
    const s=surface($("metric-limits")),{c,w,h,ink,gold,line}=s;axes(s,"Declared leading centre asymptotics","log₁₀(x)","log₁₀ magnitude");
    const L=62,R=w-20,T=35,B=h-50,xp=q=>L+(q+4)/4*(R-L),yp=q=>B-(q+1)/18*(B-T);
    c.strokeStyle=line;for(let q=-4;q<=0;q++){c.beginPath();c.moveTo(xp(q),T);c.lineTo(xp(q),B);c.stroke();c.fillStyle=ink;c.fillText(`10${["⁻⁴","⁻³","⁻²","⁻¹","⁰"][q+4]}`,xp(q)-9,B+18);}
    const draw=(fn,color)=>{c.strokeStyle=color;c.lineWidth=3;c.beginPath();for(let i=0;i<=400;i++){const lx=-4+4*i/400,y=Math.log10(fn(10**lx));i?c.lineTo(xp(lx),yp(y)):c.moveTo(xp(lx),yp(y));}c.stroke();};
    draw(()=>.25,gold);draw(q=>1.5/q**2,"#2563eb");draw(q=>2.25/q**4,"#b42318");
    const lx=Math.log10(Math.min(1,Math.max(1e-4,x)));c.strokeStyle="#7c3aed";c.setLineDash([5,4]);c.beginPath();c.moveTo(xp(lx),T);c.lineTo(xp(lx),B);c.stroke();c.setLineDash([]);
    c.fillStyle=gold;c.fillText("A→1/4",L+8,T+16);c.fillStyle="#2563eb";c.fillText("R~3/(2x²)",L+80,T+16);c.fillStyle="#b42318";c.fillText("K~9/(4x⁴)",L+178,T+16);
  }
  function velocities(x) {
    const s=surface($("metric-velocities")),{c,w,h,ink,gold,line}=s;axes(s,"Escape–fall dual scales and their exact product","log₁₀(x = r/rₛ)","velocity scale / c");
    const L=62,R=w-20,T=35,B=h-50,xp=q=>L+(q+4)/6*(R-L),yp=q=>B-Math.min(q,10)/10*(B-T);
    c.strokeStyle=line;for(let q=-4;q<=2;q++){c.beginPath();c.moveTo(xp(q),T);c.lineTo(xp(q),B);c.stroke();c.fillStyle=ink;c.fillText(`10^${q}`,xp(q)-12,B+18);}
    const draw=(fn,color)=>{c.strokeStyle=color;c.lineWidth=3;c.beginPath();for(let i=0;i<=600;i++){const lx=-4+6*i/600,y=fn(10**lx);i?c.lineTo(xp(lx),yp(y)):c.moveTo(xp(lx),yp(y));}c.stroke();};
    draw(q=>1/Math.sqrt(q),"#2563eb");draw(q=>Math.sqrt(q),gold);draw(()=>1,"#059669");
    const lx=Math.log10(x);c.strokeStyle="#b42318";c.setLineDash([5,4]);c.beginPath();c.moveTo(xp(lx),T);c.lineTo(xp(lx),B);c.stroke();c.setLineDash([]);
    c.fillStyle="#2563eb";c.fillText("vₑₛc/c",L+8,T+16);c.fillStyle=gold;c.fillText("dual vfall/c",L+75,T+16);c.fillStyle="#059669";c.fillText("product/c² = 1",L+168,T+16);
  }
  function render() {
    const x=value(),xi=SSZ.xi(x),D=SSZ.dilation(x),A=D*D,B=1/A,xip=SSZ.derivative(SSZ.xi,x),xipp=SSZ.derivative(q=>SSZ.derivative(SSZ.xi,q),x),vesc=1/Math.sqrt(x),vfall=Math.sqrt(x);
    $("metric-radius-out").textContent=fmt(x,4);$("metric-branch").textContent=SSZ.branch(x);$("metric-xi").textContent=fmt(xi);$("metric-d").textContent=fmt(D);$("metric-a").textContent=fmt(A);$("metric-b").textContent=fmt(B);$("metric-ab").textContent=fmt(A*B,9);$("metric-xip").textContent=fmt(xip);$("metric-xipp").textContent=fmt(xipp);
    $("metric-bridge-distance").textContent=x<1.8?`${fmt(1.8-x,4)} rₛ below`:x>2.2?`${fmt(x-2.2,4)} rₛ above`:"inside bridge";
    document.querySelectorAll("[data-metric-local-radius]").forEach(input=>{if(document.activeElement!==input)input.value=$("metric-radius").value;});
    document.querySelectorAll("[data-metric-local-output]").forEach(output=>output.textContent=fmt(x,4));
    $("metric-vesc").textContent=fmt(vesc);$("metric-vfall").textContent=fmt(vfall);$("metric-vproduct").textContent=fmt(vesc*vfall,9);$("metric-vproxy").textContent=fmt(Math.sqrt(Math.max(0,1-D*D)));
    $("metric-limit-a").textContent=x<=1?`${fmt(A,7)} (tends to 0.25)`:"select x≤1";geometry(x);branches(x);coefficients(x);velocities(x);limits(x);
  }
  function setLogRadius(logx, pause=true) {
    $("metric-radius").value=Math.max(-4,Math.min(2,logx));
    if(pause){playing=false;last=0;syncPlay();}
    render();
  }
  function syncPlay() {
    $("metric-play").setAttribute("aria-pressed",String(playing));
    $("metric-play").textContent=playing?"Pause radial sweep":"Play radial sweep";
    $("metric-animation-status").textContent=playing?"Animation active":"Animation paused";
    $("metric-animation-status").className=`badge ${playing?"tested":"open"}`;
  }
  function bindCanvas(canvas) {
    const select=event=>{
      const rect=canvas.getBoundingClientRect(),fraction=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
      setLogRadius(-4+6*fraction);
    };
    canvas.addEventListener("pointerdown",event=>{canvas.setPointerCapture?.(event.pointerId);select(event);});
    canvas.addEventListener("pointermove",event=>{if(event.buttons)select(event);});
    canvas.addEventListener("wheel",event=>{event.preventDefault();setLogRadius(Number($("metric-radius").value)+(event.deltaY>0?.08:-.08));},{passive:false});
    canvas.addEventListener("keydown",event=>{if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();setLogRadius(Number($("metric-radius").value)+(event.key==="ArrowRight"?.04:-.04));}});
  }
  function selectScope(mode) {
    const descriptions={
      horizon:["tested","<strong>Horizon:</strong> repeated formula and repository tests reproduce finite Ξ(rₛ), D(rₛ), A(rₛ) and B(rₛ). The synchronized probe is positioned at x=1.",0],
      centre:["warning","<strong>Centre extrapolation:</strong> the displayed R and K asymptotics diagnose the present diagonal expression as x approaches zero. This statement is limited to that extrapolation.",-4],
      completion:["open","<strong>Possible completion:</strong> a new inner metric, matching surface, minimal sphere or boundary geometry can be tested against regularity, junction, causal and stability conditions. No no-go result excludes such an SSZ construction.",-.3]
    },[kind,text,logx]=descriptions[mode]||descriptions.horizon;
    document.querySelectorAll("[data-metric-scope]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.metricScope===mode)));
    $("metric-scope-explanation").className=`callout ${kind}`;$("metric-scope-explanation").innerHTML=text;setLogRadius(logx);
  }
  function animate(now) {
    if(playing&&!reduced){if(!last)last=now;const next=Number($("metric-radius").value)+(now-last)*.00022;last=now;$("metric-radius").value=next>2?-4:next;render();}else last=0;
    frame=requestAnimationFrame(animate);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    $("metric-radius").addEventListener("input",render);
    document.querySelectorAll("[data-metric-local-radius]").forEach(input=>input.addEventListener("input",()=>setLogRadius(Number(input.value))));
    document.querySelectorAll("[data-metric-preset]").forEach(control=>control.addEventListener("click",event=>{event.stopPropagation();setLogRadius(Number(control.dataset.metricPreset));}));
    $("metric-play").addEventListener("click",()=>{playing=!playing;if(reduced&&playing){$("metric-radius").value=1;playing=false;}syncPlay();render();});
    $("metric-reset").addEventListener("click",()=>{setLogRadius(0);});
    ["metric-geometry","metric-branches","metric-coefficients","metric-velocities","metric-limits"].forEach(id=>bindCanvas($(id)));
    document.querySelectorAll("[data-metric-scope]").forEach(button=>button.addEventListener("click",()=>selectScope(button.dataset.metricScope)));
    addEventListener("resize",render);addEventListener("ssz-theme-change",render);syncPlay();render();selectScope("horizon");playing=!reduced;syncPlay();frame=requestAnimationFrame(animate);
  });
  addEventListener("pagehide",()=>cancelAnimationFrame(frame));
})();
