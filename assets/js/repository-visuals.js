(() => {
  "use strict";
  const $=id=>document.getElementById(id),value=id=>Number($(id)?.value);
  const put=(id,text)=>$(id)?.replaceChildren(document.createTextNode(String(text)));
  const fmt=(number,digits=3)=>number.toLocaleString("en-US",{maximumFractionDigits:digits});
  const G=6.67430e-11,C=299792458,M_SUN=1.98847e30,KPC=3.085677581491367e19,YEAR=365.25*86400;
  let phase=0,last=performance.now(),running=!matchMedia("(prefers-reduced-motion: reduce)").matches;

  function surface(canvas){
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.max(320,rect.width||700),h=Math.max(340,rect.height||440);
    const tw=Math.round(w*dpr),th=Math.round(h*dpr);if(canvas.width!==tw||canvas.height!==th){canvas.width=tw;canvas.height=th;}
    const c=canvas.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
    const style=getComputedStyle(document.documentElement);
    return {c,w,h,text:style.getPropertyValue("--text").trim(),muted:style.getPropertyValue("--muted").trim(),line:style.getPropertyValue("--line").trim(),gold:style.getPropertyValue("--gold").trim()};
  }
  function quantities(){
    const radiusKpc=value("galactic-radius"),speedKmS=value("galactic-speed"),ecc=value("galactic-eccentricity"),zAmp=value("galactic-z-amplitude");
    const radiusErr=value("galactic-radius-error"),speedErr=value("galactic-speed-error"),mu=value("galactic-proper-motion");
    const radius=radiusKpc*KPC,speed=speedKmS*1000,mass=4.3e6*M_SUN,rs=2*G*mass/C**2;
    const kinematic=2*Math.PI*radius/speed/YEAR/1e6,kepler=2*Math.PI*Math.sqrt(radius**3/(G*mass))/YEAR/1e6;
    const omegaPeriod=1296000000/mu/1e6;
    const enclosed=speed**2*radius/G/M_SUN;
    const xi=rs/(2*radius),D=1/(1+xi),ssz=kinematic*(1+xi),clockDelta=kinematic*xi*1e6;
    const relativeError=Math.hypot(radiusErr/radiusKpc,speedErr/speedKmS);
    const periodError=kinematic*relativeError;
    const totalSpeed=4.74047*mu*radiusKpc;
    return {radiusKpc,speedKmS,ecc,zAmp,radiusErr,speedErr,mu,kinematic,kepler,omegaPeriod,enclosed,xi,D,ssz,clockDelta,periodError,totalSpeed};
  }
  function draw(){
    const canvas=$("galactic-year-canvas");if(!canvas)return;const q=quantities(),{c,w,h,text,muted,line,gold}=surface(canvas);
    put("galactic-radius-out",`${fmt(q.radiusKpc,2)} kpc`);put("galactic-speed-out",`${fmt(q.speedKmS,0)} km/s`);
    put("galactic-eccentricity-out",fmt(q.ecc,3));put("galactic-z-amplitude-out",`${fmt(q.zAmp,3)} kpc`);
    put("galactic-radius-error-out",`±${fmt(q.radiusErr,3)} kpc`);put("galactic-speed-error-out",`±${fmt(q.speedErr,1)} km/s`);
    put("galactic-proper-motion-out",`${fmt(q.mu,3)} mas yr⁻¹`);
    put("galactic-kinematic",`${fmt(q.kinematic,2)} ± ${fmt(q.periodError,2)} Myr`);put("galactic-angular",`${fmt(q.omegaPeriod,2)} Myr`);
    put("galactic-kepler",`${fmt(q.kepler,1)} Myr`);put("galactic-enclosed",`${q.enclosed.toExponential(3)} M☉`);
    put("galactic-total-speed",`${fmt(q.totalSpeed,1)} km/s`);
    put("galactic-xi",`${q.xi.toExponential(3)} / ${q.D.toFixed(12)}`);put("galactic-clock-delta",`${fmt(q.clockDelta,4)} yr orbit⁻¹`);
    const compact=w<620,split=.58,cx=compact?w*.5:w*split*.52,cy=compact?h*.27:h*.47;
    const a=compact?Math.min(w*.34,h*.2):Math.min(w*split*.39,h*.34),b=a*Math.sqrt(1-q.ecc*q.ecc),focus=a*q.ecc;
    c.strokeStyle=line;c.lineWidth=1;c.setLineDash([5,5]);for(let r=.25;r<=1;r+=.25){c.beginPath();c.ellipse(cx-focus*r,cy,a*r,b*r,0,0,Math.PI*2);c.stroke();}
    c.setLineDash([]);c.strokeStyle=gold;c.lineWidth=3;c.beginPath();c.ellipse(cx-focus,cy,a,b,0,0,Math.PI*2);c.stroke();
    c.fillStyle=text;c.beginPath();c.arc(cx,cy,8,0,Math.PI*2);c.fill();c.fillStyle=muted;c.font="12px Inter";c.textAlign="center";c.fillText("Galactic centre",cx,cy+23);
    const angle=phase,x=cx-focus+a*Math.cos(angle),baseY=cy+b*Math.sin(angle),z=q.zAmp/.2*h*.12*Math.sin(angle*q.kinematic/70*2*Math.PI);
    c.strokeStyle="#7c3aed";c.lineWidth=2;c.beginPath();c.moveTo(x,baseY);c.lineTo(x,baseY-z);c.stroke();
    c.fillStyle="#2563eb";c.beginPath();c.arc(x,baseY-z,7,0,Math.PI*2);c.fill();
    c.fillStyle=text;c.textAlign="left";c.fillText(`parametric orbit · e=${fmt(q.ecc,3)}`,18,24);
    const chartLeft=compact?34:w*split+22,chartRight=w-18,chartTop=compact?h*.56:50,chartBottom=compact?h-34:h-58,models=[
      {name:"2πR/v",period:q.kinematic,color:gold},
      {name:"μ(Sgr A*)",period:q.omegaPeriod,color:"#2563eb"},
      {name:"declared",period:230,color:"#7c3aed"},
      {name:"Sgr A* only",period:q.kepler,color:"#b42318"}
    ],logMin=Math.log10(150),logMax=Math.log10(Math.max(20000,q.kepler*1.15));
    c.strokeStyle=line;c.beginPath();c.moveTo(chartLeft,chartTop);c.lineTo(chartLeft,chartBottom);c.lineTo(chartRight,chartBottom);c.stroke();
    models.forEach((model,index)=>{const y=chartTop+index*(chartBottom-chartTop)/3,xp=chartLeft+(Math.log10(model.period)-logMin)/(logMax-logMin)*(chartRight-chartLeft);
      c.strokeStyle=model.color;c.lineWidth=3;c.beginPath();c.moveTo(chartLeft,y);c.lineTo(xp,y);c.stroke();c.fillStyle=model.color;c.beginPath();c.arc(xp,y,6,0,Math.PI*2);c.fill();
      c.fillStyle=text;c.textAlign="left";c.fillText(model.name,chartLeft,y-10);c.fillStyle=muted;c.textAlign="right";c.fillText(`${fmt(model.period,model.period>1000?0:1)} Myr`,chartRight,y-10);});
    if(!compact){c.fillStyle=muted;c.textAlign="center";c.fillText("logarithmic period comparison",chartLeft+(chartRight-chartLeft)/2,h-20);
      c.textAlign="left";c.fillText("vertical motion: illustrative 70 Myr sinusoid from repository parameters",18,h-18);}
  }
  const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return Math.abs(a);};
  function drawChord(){
    const canvas=$("chord-canvas");if(!canvas)return;const {c,w,h,text,muted,line,gold}=surface(canvas);
    const p=Math.round(value("chord-p")),k=Math.round(value("chord-k")),radius=value("chord-radius"),common=gcd(p,k),lcm=p*k/common,mode=lcm/common,phi=window.SSZ.PHI;
    put("chord-p-out",p);put("chord-k-out",k);put("chord-radius-out",fmt(radius,2));put("chord-ratio",fmt(k/p,8));
    put("chord-phi-error",Math.abs(k/p-phi).toExponential(4));put("chord-gcd-lcm",`${common} / ${lcm}`);put("chord-mode",mode);
    const cx=w/2,cy=h/2,scale=Math.min(w,h)*.39/radius;c.strokeStyle=line;c.lineWidth=1;c.beginPath();c.moveTo(20,cy);c.lineTo(w-20,cy);c.moveTo(cx,20);c.lineTo(cx,h-20);c.stroke();
    const samples=Math.max(900,lcm*100);c.strokeStyle=gold;c.lineWidth=2;c.beginPath();
    for(let index=0;index<=samples;index++){const t=2*Math.PI*index/samples,x=cx+radius*Math.cos(p*t)*scale,y=cy+radius*Math.sin(k*t)*scale;index?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
    const t=phase,x=cx+radius*Math.cos(p*t)*scale,y=cy+radius*Math.sin(k*t)*scale;c.fillStyle="#2563eb";c.beginPath();c.arc(x,y,6,0,Math.PI*2);c.fill();
    c.fillStyle=text;c.font="13px Inter";c.textAlign="left";c.fillText(`(${p}, ${k}) · k/p=${fmt(k/p,6)}`,18,24);c.fillStyle=muted;c.fillText(`closed integer-winding curve · n=${mode}`,18,h-18);
  }
  function drawSchumann(){
    const canvas=$("schumann-canvas");if(!canvas)return;const {c,w,h,text,muted,line,gold}=surface(canvas);
    const eta=value("schumann-eta"),radiusKm=value("schumann-radius"),shift=value("schumann-shift"),modes=Math.round(value("schumann-modes")),radius=radiusKm*1000;
    const frequencies=Array.from({length:modes},(_,index)=>eta*C/(2*Math.PI*radius)*Math.sqrt((index+1)*(index+2)));
    const shifted=frequencies.map(frequency=>frequency*(1-shift));
    put("schumann-eta-out",fmt(eta,3));put("schumann-radius-out",`${fmt(radiusKm,0)} km`);put("schumann-shift-out",`${fmt(shift*100,4)}%`);put("schumann-modes-out",modes);
    put("schumann-f1",`${fmt(frequencies[0],4)} Hz`);put("schumann-f1-shifted",`${fmt(shifted[0],4)} Hz`);put("schumann-common",`${fmt(-shift*100,4)}%`);
    const left=60,right=w-25,top=40,bottom=h-55,slot=(right-left)/modes,max=Math.max(...frequencies)*1.12;
    c.strokeStyle=line;c.beginPath();c.moveTo(left,top);c.lineTo(left,bottom);c.lineTo(right,bottom);c.stroke();
    frequencies.forEach((frequency,index)=>{const x=left+(index+.5)*slot,y=bottom-frequency/max*(bottom-top),ys=bottom-shifted[index]/max*(bottom-top);
      c.strokeStyle=gold;c.lineWidth=3;c.beginPath();c.moveTo(x,bottom);c.lineTo(x,y);c.stroke();c.fillStyle=gold;c.beginPath();c.arc(x,y,6,0,Math.PI*2);c.fill();
      c.fillStyle="#2563eb";c.beginPath();c.arc(x+8,ys,5,0,Math.PI*2);c.fill();c.fillStyle=text;c.textAlign="center";c.fillText(`n=${index+1}`,x,bottom+20);c.fillStyle=muted;c.fillText(fmt(frequency,2),x,y-10);});
    c.fillStyle=gold;c.textAlign="left";c.fillText("baseline",18,20);c.fillStyle="#2563eb";c.fillText("shifted",92,20);c.fillStyle=muted;c.textAlign="center";c.fillText("frequency in Hz · uniform relative shift shown in blue",w/2,h-16);
  }
  function frame(now){if(now-last<33){requestAnimationFrame(frame);return;}if(running&&!document.hidden){phase=(phase+Math.min((now-last)/1000,.05)*.28)%(Math.PI*2);draw();drawChord();}last=now;requestAnimationFrame(frame);}
  document.addEventListener("DOMContentLoaded",()=>{
    ["galactic-radius","galactic-speed","galactic-eccentricity","galactic-z-amplitude","galactic-radius-error","galactic-speed-error","galactic-proper-motion","chord-p","chord-k","chord-radius","schumann-eta","schumann-radius","schumann-shift","schumann-modes"].forEach(id=>$(id)?.addEventListener("input",()=>{draw();drawChord();drawSchumann();}));
    addEventListener("resize",()=>{draw();drawChord();drawSchumann();});addEventListener("ssz-theme-change",()=>{draw();drawChord();drawSchumann();});addEventListener("ssz-animation-change",event=>{running=Boolean(event.detail?.running);});
    draw();drawChord();drawSchumann();requestAnimationFrame(frame);
  });
})();
