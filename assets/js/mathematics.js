(() => {
  "use strict";
  const $=id=>document.getElementById(id), phi=(1+Math.sqrt(5))/2;
  const active={radial:true,symplectic:true,chord:true,zeta:true,pi:true,hpc:true,grid:true};
  let tick=0;
  function surface(id,h=360){const el=$(id),d=Math.min(devicePixelRatio||1,2),w=Math.max(360,el.clientWidth||760);el.width=w*d;el.height=h*d;const c=el.getContext("2d");c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);return{c,w,h};}
  function axes(c,w,h,x="parameter",y="value"){c.strokeStyle="#64748b66";c.lineWidth=1;c.beginPath();c.moveTo(48,18);c.lineTo(48,h-34);c.lineTo(w-15,h-34);c.stroke();c.fillStyle="#64748b";c.font="12px sans-serif";c.fillText(x,w/2,h-8);c.save();c.translate(14,h/2);c.rotate(-Math.PI/2);c.fillText(y,0,0);c.restore();}
  function line(c,pts,color,width=2){c.strokeStyle=color;c.lineWidth=width;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
  function radial(){
    const n=+$("math-radial-n").value,span=+$("math-radial-span").value,{c,w,h}=surface("math-radial-canvas");axes(c,w,h,"x = ln(r/r₀)","normalized ψ");
    const pts=[];for(let i=0;i<500;i++){const q=i/499,x=-span+2*span*q,v=Math.exp(-x*x/(.7*span))*Math.sin(n*Math.PI*q+tick*.025);pts.push([48+q*(w-68),h/2-v*(h*.38)]);}line(c,pts,"#bb8b2f",3);
    $("math-radial-n-out").textContent=n;$("math-radial-span-out").textContent=span.toFixed(1);$("math-radial-nodes").textContent=n-1;
  }
  function symplectic(){
    const hstep=+$("math-sym-h").value,w0=+$("math-sym-w").value,{c,w,h}=surface("math-symplectic-canvas");axes(c,w,h,"q","p");
    const count=Math.max(30,Math.floor(80+tick%420)),s=[],e=[];let qs=1,ps=0,qe=1,pe=0,Hs=.5*w0*w0,He=Hs,maxS=0,maxE=0;
    for(let i=0;i<count;i++){ps-=hstep*w0*w0*qs;qs+=hstep*ps;const pne=pe-hstep*w0*w0*qe,qne=qe+hstep*pe;pe=pne;qe=qne;maxS=Math.max(maxS,Math.abs((.5*(ps*ps+w0*w0*qs*qs)-Hs)/Hs));maxE=Math.max(maxE,Math.abs((.5*(pe*pe+w0*w0*qe*qe)-He)/He));s.push([w/2+qs*w*.19,h/2-ps*h*.19]);e.push([w/2+qe*w*.19,h/2-pe*h*.19]);}
    line(c,s,"#3b82f6",3);line(c,e,"#ef4444",2);$("math-sym-h-out").textContent=hstep.toFixed(2);$("math-sym-w-out").textContent=w0.toFixed(2);$("math-sym-drift").textContent=maxS.toExponential(3);$("math-euler-drift").textContent=maxE.toExponential(3);
  }
  function chord(){
    const p=+$("math-chord-p").value,k=+$("math-chord-k").value,{c,w,h}=surface("math-chord-canvas"),pts=[],end=Math.min(1,(tick%360)/180);
    for(let i=0;i<=700*end;i++){const t=2*Math.PI*i/700;pts.push([w/2+Math.cos(p*t)*w*.38,h/2-Math.sin(k*t)*h*.4]);}line(c,pts,"#bb8b2f",2.4);$("math-chord-p-out").textContent=p;$("math-chord-k-out").textContent=k;$("math-chord-ratio").textContent=(k/p).toPrecision(8);$("math-chord-error").textContent=Math.abs(k/p-phi).toExponential(4);
  }
  function hardy(t){let s=0,N=Math.max(1,Math.floor(Math.sqrt(t/(2*Math.PI))));for(let n=1;n<=N;n++)s+=2*Math.cos(t*Math.log(n)-t/2*Math.log(t/(2*Math.PI))+t/2+Math.PI/8)/Math.sqrt(n);return s;}
  function zeta(){
    const mid=+$("math-zeta-t").value,width=+$("math-zeta-width").value,{c,w,h}=surface("math-zeta-canvas");axes(c,w,h,"t","Hardy Z diagnostic");const pts=[],vals=[];let max=1,br=0,prev=null;
    for(let i=0;i<500;i++){const t=mid-width/2+width*i/499,v=hardy(t);vals.push(v);max=Math.max(max,Math.abs(v));if(prev!==null&&v*prev<0)br++;prev=v;}vals.forEach((v,i)=>pts.push([48+i/499*(w-68),h/2-v/max*h*.4]));line(c,pts,"#8b5cf6",2.5);c.strokeStyle="#64748b66";c.beginPath();c.moveTo(48,h/2);c.lineTo(w-15,h/2);c.stroke();const scan=48+(tick%500)/499*(w-68);c.strokeStyle="#bb8b2f";c.beginPath();c.moveTo(scan,18);c.lineTo(scan,h-34);c.stroke();$("math-zeta-t-out").textContent=mid.toFixed(3);$("math-zeta-width-out").textContent=width.toFixed(1);$("math-zeta-brackets").textContent=br;
  }
  function pi(){
    const terms=+$("math-pi-terms").value,{c,w,h}=surface("math-pi-canvas");axes(c,w,h,"Chudnovsky term k","estimated correct digits");const pts=[],shown=Math.max(1,Math.min(terms,1+Math.floor((tick%300)/15)));for(let k=1;k<=terms;k++)pts.push([48+(k-1)/Math.max(1,terms-1)*(w-68),h-34-(14.18*k)/(14.18*terms)*(h-60)]);line(c,pts.slice(0,shown),"#bb8b2f",3);for(const [x,y] of pts.slice(0,shown)){c.fillStyle="#3b82f6";c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill();}$("math-pi-terms-out").textContent=terms;$("math-pi-digits").textContent=Math.floor(14.18*terms);
  }
  function hpc(){
    const N=+$("math-hpc-n").value,s=+$("math-hpc-s").value,{c,w,h}=surface("math-hpc-canvas");axes(c,w,h,"workers N","speedup S(N)");const pts=[];for(let n=1;n<=256;n++){const speed=1/(s+(1-s)/n);pts.push([48+(n-1)/255*(w-68),h-34-speed/(1/(s+(1-s)/256))*(h-60)]);}line(c,pts,"#3b82f6",3);const speed=1/(s+(1-s)/N);$("math-hpc-n-out").textContent=N;$("math-hpc-s-out").textContent=s.toFixed(3);$("math-hpc-speed").textContent=speed.toFixed(3)+"×";$("math-hpc-eff").textContent=(100*speed/N).toFixed(2)+"%";
  }
  function grid(){
    const m=+$("math-grid-m").value,mode=$("math-grid-mode").value,yaw=(+$("math-grid-angle").value+(active.grid?tick*.16:0))*Math.PI/180,pitch=+$("math-grid-pitch").value*Math.PI/180,{c,w,h}=surface("math-grid-canvas",440),cx=w/2,cy=h/2,points=[],edges=[],index=(x,y,z)=>z*m*m+y*m+x,layers=mode==="3d"?m:1;
    for(let z=0;z<layers;z++)for(let y=0;y<m;y++)for(let x=0;x<m;x++)points.push({x:x-(m-1)/2,y:y-(m-1)/2,z:z-(layers-1)/2});
    for(let z=0;z<layers;z++)for(let y=0;y<m;y++)for(let x=0;x<m;x++){const i=index(x,y,z);if(x<m-1)edges.push([i,index(x+1,y,z)]);if(y<m-1)edges.push([i,index(x,y+1,z)]);if(z<layers-1)edges.push([i,index(x,y,z+1)]);}
    const scale=Math.min(w,h)*(mode==="3d"?.58:.7)/Math.max(1,m-1),project=p=>{const x1=p.x*Math.cos(yaw)-p.z*Math.sin(yaw),z1=p.x*Math.sin(yaw)+p.z*Math.cos(yaw),y1=p.y*Math.cos(pitch)-z1*Math.sin(pitch),z2=p.y*Math.sin(pitch)+z1*Math.cos(pitch),perspective=mode==="3d"?4.5/(4.5+z2/Math.max(1,m-1)):1;return{x:cx+x1*scale*perspective,y:cy+y1*scale*perspective,z:z2,p:perspective};},screen=points.map(project);
    edges.sort((a,b)=>(screen[a[0]].z+screen[a[1]].z)-(screen[b[0]].z+screen[b[1]].z));for(const [i,j] of edges){const depth=(screen[i].p+screen[j].p)/2;c.strokeStyle=mode==="3d"?`rgba(59,130,246,${Math.max(.18,Math.min(.82,.42*depth))})`:"#64748b99";c.lineWidth=mode==="3d"?Math.max(.7,1.25*depth):1.2;c.beginPath();c.moveTo(screen[i].x,screen[i].y);c.lineTo(screen[j].x,screen[j].y);c.stroke();}
    [...screen].sort((a,b)=>a.z-b.z).forEach(p=>{c.fillStyle=mode==="3d"?"#bb8b2f":"#2563eb";c.beginPath();c.arc(p.x,p.y,Math.max(2.2,4*p.p),0,Math.PI*2);c.fill();});
    const pointCount=mode==="3d"?m**3:m**2,edgeCount=mode==="3d"?3*m*m*(m-1):2*m*(m-1);$("math-grid-m-out").textContent=m;$("math-grid-angle-out").textContent=Math.round((yaw*180/Math.PI)%360)+"°";$("math-grid-pitch-out").textContent=Math.round(pitch*180/Math.PI)+"°";$("math-grid-points").textContent=pointCount.toLocaleString();$("math-grid-edges").textContent=edgeCount.toLocaleString();$("math-grid-point-law").textContent=mode==="3d"?"points n=m³":"points n=m²";$("math-grid-edge-law").textContent=mode==="3d"?"unit edges 3m²(m−1)":"unit edges 2m(m−1)";$("math-grid-note").textContent=mode==="3d"?"True cubic unit-distance graph under perspective projection. Camera motion does not change the underlying Euclidean distances.":"2D Euclidean lattice under a rigid rotation; every displayed edge has exact unit length.";
  }
  const draws={radial,symplectic,chord,zeta,pi,hpc,grid};
  document.querySelectorAll(".math-play").forEach(b=>b.addEventListener("click",()=>{const key=b.dataset.mathPlay;active[key]=!active[key];b.textContent=active[key]?`Pause ${key==="symplectic"?"integration":key==="chord"?"trace":key==="zeta"?"scan":key==="hpc"?"worker sweep":key==="grid"?"construction":key==="pi"?"convergence":"mode sweep"}`:"Resume animation";}));
  document.querySelectorAll("input[id^='math-']").forEach(el=>el.addEventListener("input",()=>Object.values(draws).forEach(fn=>fn())));
  document.querySelectorAll("select[id^='math-']").forEach(el=>el.addEventListener("change",()=>Object.values(draws).forEach(fn=>fn())));
  function loop(){tick++;if(tick===1||tick%3===0)for(const [k,fn] of Object.entries(draws))if(active[k]||tick===1)fn();requestAnimationFrame(loop);}
  addEventListener("resize",()=>Object.values(draws).forEach(fn=>fn()));loop();
})();
