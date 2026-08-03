(() => {
  "use strict";
  const PHI=window.SSZ.PHI, X0=1.8, X1=2.2, H=X1-X0;
  const $=id=>document.getElementById(id), strong=window.SSZ.strong, weak=window.SSZ.weak;
  const sd1=x=>-PHI*Math.exp(-PHI/x)/x**2, sd2=x=>Math.exp(-PHI/x)*(2*PHI/x**3-PHI**2/x**4);
  const wd1=x=>-1/(2*x**2), wd2=x=>1/x**3;
  function blend(x){const t=(x-X0)/H,t2=t*t,t3=t2*t,t4=t3*t,t5=t4*t;
    const h00=1-10*t3+15*t4-6*t5,h10=t-6*t3+8*t4-3*t5,h20=(t2-3*t3+3*t4-t5)/2;
    const h01=10*t3-15*t4+6*t5,h11=-4*t3+7*t4-3*t5,h21=(t3-2*t4+t5)/2;
    return h00*strong(X0)+H*h10*sd1(X0)+H*H*h20*sd2(X0)+h01*weak(X1)+H*h11*wd1(X1)+H*H*h21*wd2(X1);}
  const xi=window.SSZ.xi,D=window.SSZ.dilation,regime=window.SSZ.branch;
  const derivative=(fn,x,h=1e-5)=>(fn(x+h)-fn(x-h))/(2*h),second=(fn,x,h=2e-4)=>(fn(x+h)-2*fn(x)+fn(x-h))/h**2;
  const colour=name=>getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const fmt=(n,d=8)=>Number(n).toLocaleString("en-US",{maximumFractionDigits:d});
  function draw(){
    const canvas=$("regime-canvas");if(!canvas)return;const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.max(320,rect.width),h=Math.max(360,rect.height);
    const targetW=Math.round(w*dpr),targetH=Math.round(h*dpr);
    if(canvas.width!==targetW||canvas.height!==targetH){canvas.width=targetW;canvas.height=targetH;}
    const c=canvas.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
    const probe=Number($("regime-radius").value),max=Number($("regime-span").value),log=$("regime-log").checked,showDerivatives=$("regime-derivatives").checked;
    $("regime-radius").max=max;$("regime-radius-out").textContent=fmt(probe,3);$("regime-span-out").textContent=fmt(max,1);$("regime-name").textContent=regime(probe);
    const value=xi(probe),d1=derivative(xi,probe),d2=second(xi,probe);$("regime-xi").textContent=fmt(value,10);$("regime-d").textContent=fmt(D(probe),10);$("regime-d1").textContent=fmt(d1,9);$("regime-d2").textContent=fmt(d2,8);$("regime-ab").textContent="1.000000000";
    const a={l:62,r:w-24,t:28,b:h-52},min=.2,xp=x=>a.l+(log?(Math.log(x)-Math.log(min))/(Math.log(max)-Math.log(min)):(x-min)/(max-min))*(a.r-a.l),yp=y=>a.b-y*(a.b-a.t);
    c.fillStyle=colour("--surface-2");[[min,X0,"rgba(180,35,24,.08)"],[X0,X1,"rgba(184,134,11,.11)"],[X1,max,"rgba(37,99,235,.07)"]].forEach(([lo,hi,col])=>{c.fillStyle=col;c.fillRect(xp(lo),a.t,xp(hi)-xp(lo),a.b-a.t);});
    c.strokeStyle=colour("--line");c.lineWidth=1;c.beginPath();c.moveTo(a.l,a.t);c.lineTo(a.l,a.b);c.lineTo(a.r,a.b);c.stroke();
    const points=Array.from({length:700},(_,i)=>log?Math.exp(Math.log(min)+(Math.log(max)-Math.log(min))*i/699):min+(max-min)*i/699);
    function curve(fn,col,width=3,dash=[]){c.strokeStyle=col;c.lineWidth=width;c.setLineDash(dash);c.beginPath();points.forEach((x,i)=>{const y=fn(x),px=xp(x),py=yp(y);i?c.lineTo(px,py):c.moveTo(px,py)});c.stroke();c.setLineDash([]);}
    curve(xi,colour("--gold"));if(showDerivatives){curve(x=>Math.max(-.25,Math.min(1,derivative(xi,x))),"#2563eb",1.7,[6,4]);curve(x=>Math.max(-.25,Math.min(1,second(xi,x))),"#7c3aed",1.4,[2,4]);}
    [X0,X1].forEach(x=>{c.strokeStyle=colour("--muted");c.setLineDash([4,4]);c.beginPath();c.moveTo(xp(x),a.t);c.lineTo(xp(x),a.b);c.stroke();c.setLineDash([]);});
    c.strokeStyle=colour("--text");c.beginPath();c.moveTo(xp(probe),a.t);c.lineTo(xp(probe),a.b);c.stroke();c.fillStyle=colour("--gold");c.beginPath();c.arc(xp(probe),yp(value),6,0,Math.PI*2);c.fill();
    c.fillStyle=colour("--text");c.font="12px Inter";c.textAlign="center";c.fillText("normalised radius x = r/rₛ",w/2,h-16);c.fillText("1.8",xp(X0),a.b+18);c.fillText("2.2",xp(X1),a.b+18);
  }
  document.addEventListener("DOMContentLoaded",()=>{["regime-radius","regime-span","regime-log","regime-derivatives"].forEach(id=>$(id).addEventListener("input",draw));addEventListener("resize",draw);addEventListener("ssz-theme-change",draw);draw();});
})();
