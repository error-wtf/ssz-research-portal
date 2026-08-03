(() => {
  "use strict";
  const $=id=>document.getElementById(id), canvas=$("weak-field-canvas"); if(!canvas)return;
  const rsSun=2953.339382;
  function fmt(v){return !v?"0":(Math.abs(v)<1e-4||Math.abs(v)>1e6?v.toExponential(6):v.toPrecision(8));}
  function update(){
    const lx=+$("wf-x").value,x=10**lx,m=10**(+$("wf-mass").value),u=1/(2*x),d=1/(1+u),d1=1-u,res=Math.abs(d-d1),radius=x*rsSun*m;
    $("wf-x-out").textContent=lx.toFixed(2);$("wf-mass-out").textContent=`${fmt(m)} M☉`;$("wf-u").textContent=fmt(u);$("wf-d").textContent=d.toPrecision(12);$("wf-d1").textContent=d1.toPrecision(12);$("wf-residual").textContent=fmt(res);$("wf-radius").textContent=radius>9.461e15?`${fmt(radius/9.461e15)} ly`:`${fmt(radius/1000)} km`;
    const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(400,canvas.clientWidth||800),h=390;canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
    c.strokeStyle="#64748b55";for(let i=0;i<6;i++){const y=30+i*62;c.beginPath();c.moveTo(65,y);c.lineTo(w-20,y);c.stroke();}
    function curve(color,fn){c.strokeStyle=color;c.lineWidth=3;c.beginPath();for(let i=0;i<500;i++){const q=i/499,L=.35+q*11.65,X=10**L,v=Math.max(1e-26,fn(X)),yv=(Math.log10(v)+26)/26,px=65+q*(w-90),py=h-45-yv*(h-80);i?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();}
    curve("#bb8b2f",X=>Math.abs(1/(1+1/(2*X))-(1-1/(2*X))));curve("#3b82f6",X=>1/(2*X));
    const px=65+(lx-.35)/11.65*(w-90);c.strokeStyle="#11182799";c.beginPath();c.moveTo(px,25);c.lineTo(px,h-45);c.stroke();
    c.fillStyle="#64748b";c.font="12px sans-serif";c.fillText("log₁₀(r/rₛ)",w/2,h-10);c.fillStyle="#3b82f6";c.fillText("U",75,20);c.fillStyle="#bb8b2f";c.fillText("|D exact − D first order|",105,20);
  }
  ["wf-x","wf-mass"].forEach(id=>$(id).addEventListener("input",update));addEventListener("resize",update);update();
})();
