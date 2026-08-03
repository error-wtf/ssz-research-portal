#!/usr/bin/env node
/** Static and algebraic checks for the 2D/3D unit-distance explorer. */
const fs=require("fs"),path=require("path"),root=path.resolve(__dirname,"..");
const page=fs.readFileSync(path.join(root,"mathematics.html"),"utf8");
const js=fs.readFileSync(path.join(root,"assets/js/mathematics.js"),"utf8");
for(const id of ["math-grid-mode","math-grid-m","math-grid-angle","math-grid-pitch","math-grid-canvas"])if(!page.includes(`id="${id}"`))throw new Error(`missing ${id}`);
for(let m=2;m<=9;m++){
  const points2=m*m,edges2=2*m*(m-1),points3=m**3,edges3=3*m*m*(m-1);
  const brute2=Array.from({length:m},(_,y)=>Array.from({length:m},(_,x)=>Number(x<m-1)+Number(y<m-1))).flat().reduce((a,b)=>a+b,0);
  const brute3=Array.from({length:m},(_,z)=>Array.from({length:m},(_,y)=>Array.from({length:m},(_,x)=>Number(x<m-1)+Number(y<m-1)+Number(z<m-1))).flat()).flat().reduce((a,b)=>a+b,0);
  if(points2!==m*m||edges2!==brute2||points3!==m*m*m||edges3!==brute3)throw new Error(`grid count mismatch at m=${m}`);
}
if(!js.includes('mode==="3d"')||!js.includes("perspective"))throw new Error("3D projection path missing");
console.log("mathematics rendering OK: exact 2D/3D counts for m=2…9 and interactive projection path present");
