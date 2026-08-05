(() => {
  "use strict";
  const $=id=>document.getElementById(id), num=id=>Number($(id)?.value);
  const G=6.67430e-11,C=299792458,MS=1.98847e30,KPC=3.085677581491367e19,YEAR=365.25*86400,MBH=4.3e6*MS;
  const state={mode:"measurements",view:"free",yaw:-.72,pitch:.62,distance:20,panX:0,panY:0,drag:false,lastX:0,lastY:0,playing:false,last:performance.now()};
  let gl,program,positionBuffer,uMatrix,uColour,uSize,webglOK=false;
  const identity=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  function multiply(a,b){const o=new Float32Array(16);for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
  function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far),o=new Float32Array(16);o[0]=f/aspect;o[5]=f;o[10]=(far+near)*nf;o[11]=-1;o[14]=2*far*near*nf;return o;}
  function lookAt(eye,target,up){let z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x),o=identity();o[0]=x[0];o[1]=y[0];o[2]=z[0];o[4]=x[1];o[5]=y[1];o[6]=z[1];o[8]=x[2];o[9]=y[2];o[10]=z[2];o[12]=-dot(x,eye);o[13]=-dot(y,eye);o[14]=-dot(z,eye);return o;}
  const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n);};
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  function initGL(){
    const canvas=$("galactic-webgl");gl=canvas.getContext("webgl",{antialias:true,preserveDrawingBuffer:true,alpha:true});if(!gl)throw Error("WebGL unavailable");
    program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,"attribute vec3 p;uniform mat4 m;uniform float size;void main(){gl_Position=m*vec4(p,1.);gl_PointSize=size;}"));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,"precision mediump float;uniform vec4 colour;void main(){gl_FragColor=colour;}"));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);positionBuffer=gl.createBuffer();uMatrix=gl.getUniformLocation(program,"m");uColour=gl.getUniformLocation(program,"colour");uSize=gl.getUniformLocation(program,"size");gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.DEPTH_TEST);webglOK=true;
  }
  function calculate({R,dR,v,dv,mu,e,zAmp,zPeriod,zScale,time}){
    const r=R*KPC,s=v*1000,period=2*Math.PI*r/s/YEAR/1e6,periodMu=1296000000/mu/1e6,periodBH=2*Math.PI*Math.sqrt(r**3/(G*MBH))/YEAR/1e6,enclosed=s*s*r/G/MS,xi=G*MBH/(C*C*r),D=1/(1+xi),clock=time*1e6*xi,phase=2*Math.PI*time/period,phaseBH=2*Math.PI*time/periodBH;
    return{R,dR,v,dv,mu,e,zAmp,zPeriod,zScale,time,period,periodMu,periodBH,enclosed,xi,D,clock,phase,phaseBH};
  }
  function q(){return calculate({R:num("galactic-radius"),dR:num("galactic-radius-error"),v:num("galactic-speed"),dv:num("galactic-speed-error"),mu:num("galactic-proper-motion"),e:num("galactic-eccentricity"),zAmp:num("galactic-z-amplitude"),zPeriod:num("galactic-z-period"),zScale:num("galactic-z-scale"),time:num("galactic-time")});}
  function orbit(Q,R=Q.R,count=420,period=Q.period){const a=R,b=a*Math.sqrt(1-Q.e*Q.e),out=[];for(let i=0;i<=count;i++){const f=i/count,t=f*period,ang=f*Math.PI*2,z=Q.zAmp*Q.zScale*Math.sin(2*Math.PI*t/Q.zPeriod);out.push(a*(Math.cos(ang)-Q.e),z,b*Math.sin(ang));}return out;}
  function disk(){const out=[];for(let ring=1;ring<=10;ring++){const r=ring*1.05;for(let i=0;i<=128;i++){const a=i/128*Math.PI*2;out.push(r*Math.cos(a),0,r*Math.sin(a));}}return out;}
  function axes(){return[-11,0,0,11,0,0,0,-4,0,0,4,0,0,0,-11,0,0,11];}
  function colour(hex,a=1){const n=parseInt(hex.slice(1),16);return[((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255,a];}
  function draw(vertices,mode,rgba,size=1){
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW);const loc=gl.getAttribLocation(program,"p");gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);gl.uniform4fv(uColour,rgba);gl.uniform1f(uSize,size);gl.drawArrays(mode,0,vertices.length/3);
  }
  function point(pos,rgba,size=10){draw(pos,gl.POINTS,rgba,size);}
  function resize(canvas){const d=Math.min(devicePixelRatio||1,2),w=Math.max(480,canvas.clientWidth),h=Math.max(480,canvas.clientHeight);if(canvas.width!==w*d||canvas.height!==h*d){canvas.width=w*d;canvas.height=h*d;}gl.viewport(0,0,canvas.width,canvas.height);return{w,h};}
  function cameraMatrix(w,h){
    let eye;if(state.view==="top")eye=[0,26,0.001];else if(state.view==="side")eye=[0,.001,26];else{eye=[state.distance*Math.cos(state.pitch)*Math.sin(state.yaw),state.distance*Math.sin(state.pitch),state.distance*Math.cos(state.pitch)*Math.cos(state.yaw)];}
    const target=[state.panX,0,state.panY],up=state.view==="top"?[0,0,-1]:[0,1,0];return multiply(perspective(Math.PI/4,w/h,.1,100),lookAt(eye,target,up));
  }
  function currentPos(Q,bh=false){const p=bh?Q.phaseBH:Q.phase,a=Q.R,b=a*Math.sqrt(1-Q.e*Q.e),time=Q.time,z=Q.zAmp*Q.zScale*Math.sin(2*Math.PI*time/Q.zPeriod);return[a*(Math.cos(p)-Q.e),z,b*Math.sin(p)];}
  function render3D(Q){
    if(!webglOK)return;const canvas=$("galactic-webgl"),{w,h}=resize(canvas);gl.clearColor(.97,.98,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(uMatrix,false,cameraMatrix(w,h));
    for(let ring=1;ring<=10;ring++){const r=ring*1.05,vertices=[];for(let i=0;i<=128;i++){const a=i/128*Math.PI*2;vertices.push(r*Math.cos(a),0,r*Math.sin(a));}draw(vertices,gl.LINE_STRIP,colour("#94a3b8",.22));}
    for(let spoke=0;spoke<16;spoke++){const a=spoke*Math.PI/8;draw([0,0,0,10.5*Math.cos(a),0,10.5*Math.sin(a)],gl.LINES,colour("#94a3b8",.14));}
    draw(axes(),gl.LINES,colour("#64748b",.45));
    if(state.mode==="measurements"||state.mode==="compare"){draw(orbit(Q,Q.R-Q.dR),gl.LINE_STRIP,colour("#2563eb",.25));draw(orbit(Q,Q.R+Q.dR),gl.LINE_STRIP,colour("#2563eb",.25));}
    draw(orbit(Q),gl.LINE_STRIP,colour("#b8860b",1));
    const sun=currentPos(Q);point([0,0,0],colour("#111827"),13);point(sun,colour("#2563eb"),12);
    const projection=[sun[0],0,sun[2]];draw([...projection,...sun],gl.LINES,colour("#7c3aed",.8));
    const tangent=norm([-Math.sin(Q.phase),0,Math.cos(Q.phase)]),len=1.4;draw([...sun,sun[0]+tangent[0]*len,sun[1],sun[2]+tangent[2]*len],gl.LINES,colour("#16a34a"),3);
    if(state.mode==="dynamics"||state.mode==="compare"){const bh=currentPos(Q,true);draw(orbit({...Q,e:0,zAmp:0},Q.R,420,Q.periodBH),gl.LINE_STRIP,colour("#b42318",.75));point(bh,colour("#b42318"),10);}
    if(state.mode==="clock"){const trail=orbit(Q).slice(0,Math.max(6,Math.floor((Q.phase%(2*Math.PI))/(2*Math.PI)*420)*3));draw(trail,gl.LINE_STRIP,colour("#7c3aed",.9));}
    const role=state.mode==="measurements"?"adopted measurements + uncertainty shell":state.mode==="dynamics"?"extended-potential kinematics versus inadequate Sgr A* point mass":state.mode==="clock"?"separate weak-field clock diagnostic; geometry unchanged":"synchronised category comparison";
    $("galactic-overlay").innerHTML=`<strong>${state.mode.toUpperCase()}</strong><span>t=${Q.time.toFixed(1)} Myr · phase=${((Q.phase*180/Math.PI)%360).toFixed(1)}°</span><span>vertical display ×${Q.zScale}${Q.zScale>1?" · EXAGGERATED":""}</span><small>${role}</small>`;
  }
  function surface2d(id){const canvas=$(id),d=Math.min(devicePixelRatio||1,2),w=Math.max(280,canvas.clientWidth),h=190;canvas.width=w*d;canvas.height=h*d;const c=canvas.getContext("2d");c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);return{canvas,c,w,h};}
  function mini(Q){
    const gold="#b8860b",blue="#2563eb",muted="#64748b";
    {const {c,w,h}=surface2d("galactic-top-canvas"),s=Math.min(w,h)*.38/Q.R,p=currentPos(Q);c.strokeStyle=gold;c.beginPath();for(let i=0;i<=240;i++){const a=i/240*Math.PI*2,x=w/2+Q.R*(Math.cos(a)-Q.e)*s,y=h/2+Q.R*Math.sqrt(1-Q.e**2)*Math.sin(a)*s;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.fillStyle=blue;c.beginPath();c.arc(w/2+p[0]*s,h/2+p[2]*s,5,0,Math.PI*2);c.fill();}
    {const {c,w,h}=surface2d("galactic-side-canvas");c.strokeStyle=muted;c.beginPath();c.moveTo(25,h/2);c.lineTo(w-12,h/2);c.stroke();c.strokeStyle="#7c3aed";c.beginPath();for(let i=0;i<=240;i++){const t=Q.period*i/240,x=25+(w-40)*i/240,y=h/2-Q.zAmp*Q.zScale*Math.sin(2*Math.PI*t/Q.zPeriod)*55/Math.max(Q.zAmp*Q.zScale,.01);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();const px=25+(w-40)*(Q.time%Q.period)/Q.period;c.fillStyle=blue;c.beginPath();c.arc(px,h/2-Q.zAmp*Q.zScale*Math.sin(2*Math.PI*Q.time/Q.zPeriod)*55/Math.max(Q.zAmp*Q.zScale,.01),5,0,Math.PI*2);c.fill();}
    {const {c,w,h}=surface2d("galactic-clock-canvas"),max=250e6*Q.xi;c.strokeStyle=gold;c.beginPath();c.moveTo(25,h-25);c.lineTo(w-15,25);c.stroke();const x=25+(w-40)*Q.time/250,y=h-25-(h-50)*(Q.clock/(max||1));c.fillStyle=blue;c.beginPath();c.arc(x,y,5,0,Math.PI*2);c.fill();c.fillStyle=muted;c.font="11px system-ui";c.fillText(`0 → ${max.toFixed(4)} yr over 250 Myr`,28,18);}
  }
  function outputs(Q){
    $("galactic-time-out").textContent=`${Q.time.toFixed(1)} Myr`;$("galactic-z-period-out").textContent=`${Q.zPeriod.toFixed(0)} Myr`;
    const p=currentPos(Q),zPhysical=p[1]/Q.zScale;$("galactic-state-table").innerHTML=`<tr><td>${Q.time.toFixed(2)} Myr</td><td>${((Q.phase*180/Math.PI)%360).toFixed(2)}°</td><td>${Q.R.toFixed(3)} kpc</td><td>${zPhysical.toFixed(4)} kpc${Q.zScale>1?` (shown ×${Q.zScale})`:""}</td><td>${Q.v.toFixed(1)} km/s</td><td>${Q.xi.toExponential(4)}</td><td>${Q.D.toFixed(12)}</td><td>${Q.clock.toFixed(6)} yr</td><td>${state.mode}</td></tr>`;
  }
  function redraw(){const Q=q();render3D(Q);mini(Q);outputs(Q);}
  function download(name,type,data){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href);}
  function bind(){
    const syncMotionButtons=()=>{
      const play=$("galactic-play"),rotate=$("galactic-autorotate");
      if(play){play.textContent=state.playing?"Pause motion":"Play motion";play.setAttribute("aria-pressed",String(state.playing));}
      if(rotate){rotate.textContent=state.playing?"Pause rotation":"Auto-rotate";rotate.setAttribute("aria-pressed",String(state.playing));}
    };
    const viewbar=document.querySelector('.galactic-viewbar');
    if(viewbar&&!document.getElementById('galactic-autorotate')){const b=document.createElement('button');b.id='galactic-autorotate';b.type='button';b.className='button';b.textContent='Auto-rotate';b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{state.playing=!state.playing;syncMotionButtons();});viewbar.insertBefore(b,viewbar.firstChild);}
    document.querySelectorAll("[data-galactic-mode]").forEach(button=>button.addEventListener("click",()=>{state.mode=button.dataset.galacticMode;document.querySelectorAll("[data-galactic-mode]").forEach(b=>b.classList.toggle("active",b===button));redraw();}));
    document.querySelectorAll("[data-galactic-view]").forEach(button=>button.addEventListener("click",()=>{const v=button.dataset.galacticView;if(v==="sun"){const p=currentPos(q());state.panX=p[0];state.panY=p[2];state.view="free";state.distance=8;}else state.view=v;redraw();}));
    ["galactic-radius","galactic-radius-error","galactic-speed","galactic-speed-error","galactic-proper-motion","galactic-eccentricity","galactic-z-amplitude","galactic-z-period","galactic-z-scale","galactic-time"].forEach(id=>$(id).addEventListener("input",redraw));
    const canvas=$("galactic-webgl");canvas.addEventListener("pointerdown",e=>{state.drag=true;state.lastX=e.clientX;state.lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener("pointermove",e=>{if(!state.drag)return;const dx=e.clientX-state.lastX,dy=e.clientY-state.lastY;state.lastX=e.clientX;state.lastY=e.clientY;if(e.shiftKey){state.panX-=dx*.015;state.panY+=dy*.015;}else{state.view="free";state.yaw+=dx*.008;state.pitch=Math.max(-1.4,Math.min(1.4,state.pitch+dy*.008));}redraw();});canvas.addEventListener("pointerup",()=>state.drag=false);canvas.addEventListener("wheel",e=>{e.preventDefault();state.distance=Math.max(8,Math.min(55,state.distance*Math.exp(e.deltaY*.001)));redraw();},{passive:false});canvas.addEventListener("dblclick",()=>{const p=currentPos(q());state.panX=p[0];state.panY=p[2];state.distance=8;redraw();});
    $("galactic-play").addEventListener("click",()=>{state.playing=!state.playing;syncMotionButtons();});$("galactic-export-png").addEventListener("click",()=>{const a=document.createElement("a");a.download="solar-galactic-year-3d.png";a.href=canvas.toDataURL("image/png");a.click();});$("galactic-export-data").addEventListener("click",()=>download("solar-galactic-year-state.json","application/json",JSON.stringify({generated:new Date().toISOString(),parameters:q(),scientific_roles:{R0:"measured/adopted",speed:"adopted kinematics",eccentricity:"illustrative",vertical_motion:"illustrative",point_mass:"countermodel",clock_rate:"separate SSZ weak-field diagnostic"}},null,2)));
    syncMotionButtons();
    addEventListener("resize",redraw);addEventListener("ssz-theme-change",redraw);
  }
  function animate(now){if(state.playing){const dt=Math.min((now-state.last)/1000,.1),slider=$("galactic-time");slider.value=(Number(slider.value)+dt*4)%250;state.yaw+=dt*.32;redraw();}state.last=now;requestAnimationFrame(animate);}
  window.SSZGalacticYear3D={calculate};
  document.addEventListener("DOMContentLoaded",()=>{state.playing=true;try{initGL();$("galactic-webgl-status").textContent="WebGL active · animated 3D camera · drag rotate · wheel zoom · Shift-drag pan · double-click focus";}catch(error){$("galactic-webgl-status").textContent=`WebGL unavailable: ${error.message}. The self-hosted animated 3D render remains visible above.`;}bind();const play=$("galactic-play");if(play)play.textContent="Pause";redraw();requestAnimationFrame(animate);});
})();
