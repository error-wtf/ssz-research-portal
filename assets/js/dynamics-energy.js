(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  if (!$("dynamics-potential-canvas")) return;
  const phi = (1 + Math.sqrt(5)) / 2;
  let phase = 0, playing = true, frame = 0;
  let potentialPlaying = true, potentialFrame = 0, potentialDirection = 1;
  const smooth = t => t*t*t*(t*(t*6-15)+10);
  function xi(x) {
    const strong = 1 - Math.exp(-phi / x), weak = 1 / (2*x);
    if (x < 1.8) return strong;
    if (x > 2.2) return weak;
    return strong * (1-smooth((x-1.8)/.4)) + weak * smooth((x-1.8)/.4);
  }
  const A = x => (1/(1+xi(x)))**2;
  function fit(canvas, height=330) {
    const dpr=Math.min(devicePixelRatio||1,2), w=Math.max(360,canvas.clientWidth||600);
    canvas.width=w*dpr;canvas.height=height*dpr;
    const c=canvas.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);return {c,w,h:height};
  }
  function potential() {
    const L=+$("dyn-l").value, probe=+$("dyn-r").value, {c,w,h}=fit($("dynamics-potential-canvas"));
    const fg=getComputedStyle(document.documentElement).getPropertyValue("--text")||"#172033";
    c.clearRect(0,0,w,h); c.strokeStyle="#bb8b2f"; c.lineWidth=3;c.beginPath();
    let vmax=0; const pts=[];
    for(let i=0;i<500;i++){const x=.25+i*11.75/499,v=A(x)*L*L/(x*x);vmax=Math.max(vmax,v);pts.push([x,v]);}
    pts.forEach(([x,v],i)=>{const px=48+(x-.25)/11.75*(w-70),py=h-38-v/vmax*(h-70);i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();
    [1,1.8,2.2].forEach(x=>{const px=48+(x-.25)/11.75*(w-70);c.strokeStyle="#64748b88";c.beginPath();c.moveTo(px,25);c.lineTo(px,h-38);c.stroke();});
    const pv=A(probe)*L*L/(probe*probe),px=48+(probe-.25)/11.75*(w-70),py=h-38-pv/vmax*(h-70);
    c.fillStyle="#3b82f6";c.beginPath();c.arc(px,py,6,0,Math.PI*2);c.fill();c.fillStyle=fg;c.font="12px sans-serif";c.fillText("r / rₛ",w/2,h-9);c.fillText("V",15,25);
    $("dyn-l-out").textContent=L.toFixed(2);$("dyn-r-out").textContent=probe.toFixed(2);$("dyn-a").textContent=A(probe).toPrecision(7);$("dyn-v").textContent=pv.toPrecision(7);$("dyn-branch").textContent=probe<1.8?"strong":probe<=2.2?"C² bridge":"weak";
  }
  function emergence() {
    const rays=+$("emg-rays").value,wave=+$("emg-wave").value,{c,w,h}=fit($("emergence-canvas"),330),n=92,img=c.createImageData(n,n);
    let max=0,vals=new Float32Array(n*n);
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){let f=0,X=2*x/(n-1)-1,Y=2*y/(n-1)-1;for(let k=0;k<rays;k++){const a=2*Math.PI*k/rays;f+=Math.sin(3*Math.PI*(Math.cos(a)*X+Math.sin(a)*Y)/wave+1.37*k+phase);}f=Math.abs(f)**3;vals[y*n+x]=f;max=Math.max(max,f);}
    for(let i=0;i<vals.length;i++){const q=vals[i]/max,j=4*i;img.data[j]=Math.min(255,35+330*q);img.data[j+1]=Math.min(210,12+170*q*q);img.data[j+2]=Math.min(180,38+90*(1-q));img.data[j+3]=255;}
    const off=document.createElement("canvas");off.width=n;off.height=n;off.getContext("2d").putImageData(img,0,0);c.imageSmoothingEnabled=true;c.drawImage(off,0,0,w,h);
    $("emg-rays-out").textContent=rays;$("emg-wave-out").textContent=wave.toFixed(3);
  }
  function loop(){if(!playing)return;phase+=.035;emergence();frame=requestAnimationFrame(loop);}
  function potentialLoop(){
    if(!potentialPlaying)return;
    const slider=$("dyn-r"), min=+slider.min, max=+slider.max;
    let value=+slider.value+potentialDirection*.018;
    if(value>=max){value=max;potentialDirection=-1;}
    if(value<=min){value=min;potentialDirection=1;}
    slider.value=String(value);potential();potentialFrame=requestAnimationFrame(potentialLoop);
  }
  ["dyn-l","dyn-r"].forEach(id=>$(id).addEventListener("input",potential));
  ["emg-rays","emg-wave"].forEach(id=>$(id).addEventListener("input",emergence));
  $("emg-play").addEventListener("click",()=>{playing=!playing;$("emg-play").textContent=playing?"Pause interference":"Resume interference";playing?loop():cancelAnimationFrame(frame);});
  $("dyn-play").addEventListener("click",()=>{potentialPlaying=!potentialPlaying;$("dyn-play").setAttribute("aria-pressed",String(potentialPlaying));$("dyn-play").textContent=potentialPlaying?"Pause radial sweep":"Resume radial sweep";$("dyn-motion").textContent=potentialPlaying?"radial sweep active":"paused";potentialPlaying?potentialLoop():cancelAnimationFrame(potentialFrame);});
  $("dyn-reset").addEventListener("click",()=>{$("dyn-r").value="3";potentialDirection=1;potential();});
  addEventListener("resize",()=>{potential();emergence();});potential();loop();potentialLoop();
})();
