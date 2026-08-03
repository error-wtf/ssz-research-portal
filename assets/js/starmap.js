(() => {
  "use strict";
  const DEG=Math.PI/180;
  const state={stars:[],points:[],yaw:0,pitch:0,zoom:1,drag:null,selected:null};
  const $=id=>document.getElementById(id);
  const number=id=>Number($(id)?.value);
  const text=(id,value)=>$(id)?.replaceChildren(document.createTextNode(String(value)));
  const css=name=>getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const fmt=(value,digits=2)=>Number.isFinite(value)?value.toLocaleString("en-US",{maximumFractionDigits:digits}):"—";

  function surface(){
    const canvas=$("starmap-canvas"),rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    const w=Math.max(320,rect.width||800),h=Math.max(420,rect.height||620);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    const c=canvas.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
    c.fillStyle=css("--surface");c.fillRect(0,0,w,h);
    return {canvas,c,w,h,area:{l:48,r:w-28,t:34,b:h-46}};
  }
  function colour(star,mode){
    if(mode==="temperature"){
      const t=Math.max(2500,Math.min(12000,star.temperature_k||5500)),u=(t-2500)/9500;
      return `hsl(${18+205*u} 85% ${58+10*u}%)`;
    }
    if(mode==="bp-rp"){
      const u=Math.max(0,Math.min(1,(star.bp_rp??1)/3));
      return `hsl(${220-205*u} 82% 62%)`;
    }
    if(mode==="distance"){
      const u=Math.log10(Math.max(1,star.distance_pc))/Math.log10(2000);
      return `hsl(${275-235*u} 78% 60%)`;
    }
    const u=Math.max(0,Math.min(1,(star.g_mag-2)/12));
    return `hsl(${48-25*u} 85% ${70-25*u}%)`;
  }
  function rotate3(x,y,z){
    const cy=Math.cos(state.yaw),sy=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch);
    const x1=cy*x-sy*y,y1=sy*x+cy*y;
    return [x1,cp*y1-sp*z,sp*y1+cp*z];
  }
  function mollweide(ra,dec){
    let lambda=((180-ra+state.yaw/DEG+540)%360-180)*DEG,phi=dec*DEG,theta=phi;
    for(let i=0;i<10;i++){const den=2+2*Math.cos(2*theta);if(Math.abs(den)<1e-8)break;theta-=(2*theta+Math.sin(2*theta)-Math.PI*Math.sin(phi))/den;}
    return [2*Math.SQRT2/Math.PI*lambda*Math.cos(theta),Math.SQRT2*Math.sin(theta),true];
  }
  function project(star,mode,area){
    const aw=area.r-area.l,ah=area.b-area.t,cx=(area.l+area.r)/2,cy=(area.t+area.b)/2,scale=Math.min(aw/5.8,ah/2.9)*state.zoom;
    if(mode==="mollweide"){
      const [x,y]=mollweide(star.ra_deg,star.dec_deg);return [cx+x*scale,cy-y*scale,true];
    }
    if(mode==="equatorial"){
      const ra=((star.ra_deg-state.yaw/DEG+540)%360)-180;
      return [cx-ra/180*aw*.5*state.zoom,cy-(star.dec_deg-state.pitch/DEG)/90*ah*.5*state.zoom,true];
    }
    if(mode==="gnomonic"){
      const ra0=((180-state.yaw/DEG)%360)*DEG,dec0=state.pitch,ra=star.ra_deg*DEG,dec=star.dec_deg*DEG;
      const cosc=Math.sin(dec0)*Math.sin(dec)+Math.cos(dec0)*Math.cos(dec)*Math.cos(ra-ra0);
      if(cosc<=.02)return [0,0,false];
      const x=Math.cos(dec)*Math.sin(ra-ra0)/cosc,y=(Math.cos(dec0)*Math.sin(dec)-Math.sin(dec0)*Math.cos(dec)*Math.cos(ra-ra0))/cosc;
      return [cx+x*scale*.55,cy-y*scale*.55,true];
    }
    const ra=star.ra_deg*DEG,dec=star.dec_deg*DEG,r=Math.log10(1+star.distance_pc);
    const [x,y,z]=rotate3(r*Math.cos(dec)*Math.cos(ra),r*Math.cos(dec)*Math.sin(ra),r*Math.sin(dec));
    return [cx+x*scale*.52,cy-z*scale*.52,y>-4,true,y];
  }
  function grid(c,mode,area){
    if(!$("starmap-grid").checked)return;
    c.save();c.strokeStyle=css("--line");c.lineWidth=1;c.setLineDash([3,5]);
    const cx=(area.l+area.r)/2,cy=(area.t+area.b)/2,aw=area.r-area.l,ah=area.b-area.t;
    if(mode==="cartesian"){
      c.setLineDash([]);c.beginPath();c.moveTo(area.l,cy);c.lineTo(area.r,cy);c.moveTo(cx,area.t);c.lineTo(cx,area.b);c.stroke();
      [1,2,3].forEach(r=>{c.beginPath();c.arc(cx,cy,r*Math.min(aw,ah)/7,0,Math.PI*2);c.stroke();});
    } else if(mode==="mollweide"){
      c.beginPath();c.ellipse(cx,cy,Math.min(aw/2,ah),Math.min(aw/4,ah/2),0,0,Math.PI*2);c.stroke();
      for(let dec=-60;dec<=60;dec+=30){c.beginPath();for(let ra=0;ra<=360;ra+=3){const fake={ra_deg:ra,dec_deg:dec},[x,y]=project(fake,mode,area);ra?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
      for(let ra=0;ra<360;ra+=30){c.beginPath();for(let dec=-89;dec<=89;dec+=2){const fake={ra_deg:ra,dec_deg:dec},[x,y]=project(fake,mode,area);dec>-89?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
    } else {
      for(let i=0;i<=6;i++){const x=area.l+i*aw/6;c.beginPath();c.moveTo(x,area.t);c.lineTo(x,area.b);c.stroke();}
      for(let i=0;i<=6;i++){const y=area.t+i*ah/6;c.beginPath();c.moveTo(area.l,y);c.lineTo(area.r,y);c.stroke();}
    }
    c.restore();
  }
  function draw(){
    const {c,w,h,area}=surface(),mode=$("starmap-projection").value,maxCount=number("starmap-count"),maxDistance=number("starmap-distance"),maxMag=number("starmap-mag"),colourMode=$("starmap-colour").value;
    text("starmap-count-out",maxCount);text("starmap-distance-out",`${maxDistance} pc`);text("starmap-mag-out",fmt(maxMag,1));text("starmap-projection-out",mode);
    grid(c,mode,area);
    const filtered=state.stars.filter(star=>star.distance_pc<=maxDistance&&star.g_mag<=maxMag).slice(0,maxCount);
    const points=filtered.map(star=>{const [x,y,visible,depth]=project(star,mode,area);return {star,x,y,visible:visible&&x>=area.l&&x<=area.r&&y>=area.t&&y<=area.b,depth:depth||0};}).filter(point=>point.visible);
    if(mode==="cartesian")points.sort((a,b)=>a.depth-b.depth);
    const motion=$("starmap-motion").checked;
    points.forEach(point=>{
      const size=Math.max(1.2,5.5-(point.star.g_mag-2)*.45);
      if(motion&&Number.isFinite(point.star.pmra_mas_yr)&&Number.isFinite(point.star.pmdec_mas_yr)){
        const norm=Math.hypot(point.star.pmra_mas_yr,point.star.pmdec_mas_yr)||1,vector=Math.min(24,Math.log10(1+norm)*8);
        c.strokeStyle=css("--muted");c.globalAlpha=.45;c.beginPath();c.moveTo(point.x,point.y);c.lineTo(point.x+point.star.pmra_mas_yr/norm*vector,point.y-point.star.pmdec_mas_yr/norm*vector);c.stroke();
      }
      c.globalAlpha=.86;c.fillStyle=colour(point.star,colourMode);c.beginPath();c.arc(point.x,point.y,size,0,Math.PI*2);c.fill();
      if(state.selected?.source_id===point.star.source_id){c.globalAlpha=1;c.strokeStyle=css("--gold");c.lineWidth=2;c.beginPath();c.arc(point.x,point.y,size+5,0,Math.PI*2);c.stroke();}
    });
    c.globalAlpha=1;c.fillStyle=css("--text");c.font="600 12px Inter, sans-serif";c.textAlign="left";c.fillText(`${mode} · drag / wheel / arrows`,area.l,20);
    c.textAlign="right";c.fillText(`zoom ${fmt(state.zoom,2)}×`,area.r,20);
    state.points=points;text("starmap-visible",points.length);
    window.SSZStarmapState={loaded:state.stars.length,visible:points.length,projection:mode};
  }
  function inspect(x,y,select=false){
    const nearest=state.points.reduce((best,p)=>{const d=Math.hypot(p.x-x,p.y-y);return !best||d<best.d?{p,d}:best;},null);
    if(!nearest||nearest.d>14)return;
    const star=nearest.p.star;
    if(select)state.selected=star;
    text("starmap-selected",`Gaia ${star.source_id.slice(-8)}`);
    $("starmap-detail").innerHTML=`<strong>Gaia source ${star.source_id}</strong><span>RA ${fmt(star.ra_deg,5)}° · Dec ${fmt(star.dec_deg,5)}°</span><span>Distance ${fmt(star.distance_pc,2)} pc · parallax ${fmt(star.parallax_mas,3)} mas</span><span>G ${fmt(star.g_mag,3)} · BP−RP ${fmt(star.bp_rp,3)} · T ${fmt(star.temperature_k,0)} K</span><span>μ<sub>RA</sub> ${fmt(star.pmra_mas_yr,2)} · μ<sub>Dec</sub> ${fmt(star.pmdec_mas_yr,2)} mas yr⁻¹</span><small>${star.temperature_source||"No temperature provenance stated"}</small>`;
    if(select)draw();
  }
  document.addEventListener("DOMContentLoaded",async()=>{
    const canvas=$("starmap-canvas");
    ["starmap-projection","starmap-count","starmap-distance","starmap-mag","starmap-colour","starmap-motion","starmap-grid"].forEach(id=>$(id).addEventListener("input",draw));
    canvas.addEventListener("pointerdown",event=>{canvas.setPointerCapture?.(event.pointerId);state.drag={x:event.clientX,y:event.clientY,yaw:state.yaw,pitch:state.pitch};});
    canvas.addEventListener("pointermove",event=>{const rect=canvas.getBoundingClientRect();if(state.drag){state.yaw=state.drag.yaw+(event.clientX-state.drag.x)*.006;state.pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,state.drag.pitch+(event.clientY-state.drag.y)*.006));draw();}else inspect(event.clientX-rect.left,event.clientY-rect.top);});
    canvas.addEventListener("pointerup",event=>{const rect=canvas.getBoundingClientRect();if(state.drag&&Math.hypot(event.clientX-state.drag.x,event.clientY-state.drag.y)<5)inspect(event.clientX-rect.left,event.clientY-rect.top,true);state.drag=null;});
    canvas.addEventListener("wheel",event=>{event.preventDefault();state.zoom=Math.max(.5,Math.min(8,state.zoom*Math.exp(-event.deltaY*.001)));draw();},{passive:false});
    canvas.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-"].includes(event.key))return;event.preventDefault();if(event.key==="ArrowLeft")state.yaw-=.08;if(event.key==="ArrowRight")state.yaw+=.08;if(event.key==="ArrowUp")state.pitch-=.08;if(event.key==="ArrowDown")state.pitch+=.08;if(event.key==="+")state.zoom=Math.min(8,state.zoom*1.15);if(event.key==="-")state.zoom=Math.max(.5,state.zoom/1.15);draw();});
    $("starmap-reset").addEventListener("click",()=>{state.yaw=0;state.pitch=0;state.zoom=1;state.selected=null;draw();});
    $("starmap-export").addEventListener("click",()=>{const link=document.createElement("a");link.download="ssz-starmaps-catalogue.png";link.href=canvas.toDataURL("image/png");link.click();});
    addEventListener("resize",draw);addEventListener("ssz-theme-change",draw);
    try{
      const response=await fetch("data/starmap-stars.json");if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json();state.stars=data.stars||[];text("starmap-loaded",`${state.stars.length} Gaia stars`);draw();
    }catch(error){text("starmap-loaded","catalogue unavailable");$("starmap-detail").textContent=`Load error: ${error.message}`;}
  });
})();
