#!/usr/bin/env python3
"""Generate high-precision, provenance-aware static strong-field certificates."""
from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path
import mpmath as mp

ROOT = Path(__file__).resolve().parents[1]
mp.mp.dps = 60
PHI = (1 + mp.sqrt(5)) / 2


def strong(x): return 1 - mp.exp(-PHI / x)
def weak(x): return 1 / (2 * x)


def bridge(x, x0=mp.mpf("1.8"), x1=mp.mpf("2.2"), epsilon=mp.mpf("0")):
    h=x1-x0; t=(x-x0)/h
    y0,y1=strong(x0),weak(x1)
    e0=mp.exp(-PHI/x0)
    d0,d1=-PHI*e0/x0**2,-1/(2*x1**2)
    dd0,dd1=e0*(2*PHI/x0**3-PHI**2/x0**4),1/x1**3
    a0=y0; a1=h*d0; a2=h*h*dd0/2
    A=y1-a0-a1-a2; B=h*d1-a1-2*a2; Q=h*h*dd1-2*a2
    a3=10*A-4*B+Q/2; a4=-15*A+7*B-Q; a5=6*A-3*B+Q/2
    return a0+a1*t+a2*t*t+a3*t**3+a4*t**4+a5*t**5 + epsilon*t**3*(1-t)**3


def xi(x,x0=mp.mpf("1.8"),x1=mp.mpf("2.2"),epsilon=mp.mpf("0")):
    return strong(x) if x<x0 else weak(x) if x>x1 else bridge(x,x0,x1,epsilon)


def A(x,*args): return 1/(1+xi(x,*args))**2
def null_potential(x,*args): return A(x,*args)/x**2
def l2(x,*args):
    a=A(x,*args); ap=mp.diff(lambda q:A(q,*args),x)
    return x**3*ap/(2*a-x*ap)


def roots_by_sampling(fn,lo,hi,steps=240):
    roots=[]; left=lo; fl=fn(left)
    for index in range(1,steps+1):
        right=lo+(hi-lo)*index/steps; fr=fn(right)
        if mp.isfinite(fl) and mp.isfinite(fr) and fl*fr<0:
            a,b=left,right; fa=fl
            for _ in range(180):
                mid=(a+b)/2; fm=fn(mid)
                if fa*fm<=0:b=mid
                else:a=mid;fa=fm
            roots.append((a+b)/2)
        left,fl=right,fr
    return roots


def certify(x0=mp.mpf("1.8"),x1=mp.mpf("2.2"),epsilon=mp.mpf("0"),include_timelike=True):
    args=(x0,x1,epsilon)
    dnull=lambda x:mp.diff(lambda q:null_potential(q,*args),x)
    null_roots=roots_by_sampling(dnull,x0,x1)
    maxima=[root for root in null_roots if mp.diff(lambda q:null_potential(q,*args),root,2)<0]
    photon=max(maxima,key=lambda root:null_potential(root,*args)) if maxima else None
    dl2=lambda x:mp.diff(lambda q:l2(q,*args),x)
    minima=[]
    if include_timelike:
        l2_roots=roots_by_sampling(dl2,max(x0,(photon or x0)+mp.mpf("1e-8")),x1)
        minima=[root for root in l2_roots if mp.diff(lambda q:l2(q,*args),root,2)>0]
    isco=minima[0] if minima else None
    result={"x0":str(x0),"x1":str(x1),"epsilon":str(epsilon)}
    if photon:
        newton=mp.findroot(dnull,photon)
        result["photon_candidate"]={
            "x":mp.nstr(photon,60),"newton_x":mp.nstr(newton,60),
            "derivative_residual":mp.nstr(abs(dnull(photon)),12),
            "second_derivative":mp.nstr(mp.diff(lambda q:null_potential(q,*args),photon,2),30),
            "extremum":"maximum","critical_impact_proxy":mp.nstr(photon/mp.sqrt(A(photon,*args)),60),
            "methods":["240-cell derivative sign scan","180-step bisection","60-digit Newton/secant refinement"],
        }
    if isco:
        result["timelike_l2_candidate"]={
            "x":mp.nstr(isco,60),"derivative_residual":mp.nstr(abs(dl2(isco)),12),
            "second_derivative":mp.nstr(mp.diff(lambda q:l2(q,*args),isco,2),30),"extremum":"minimum",
        }
    return result


canonical=certify()
variants=[certify(mp.mpf(str(x0)),mp.mpf(str(x1)),mp.mpf(str(eps)),False)
          for x0 in (1.75,1.8,1.85) for x1 in (2.15,2.2,2.25) for eps in (-.02,0,.02)]
photon_values=[mp.mpf(row["photon_candidate"]["x"]) for row in variants if "photon_candidate" in row]
impact_values=[mp.mpf(row["photon_candidate"]["critical_impact_proxy"]) for row in variants if "photon_candidate" in row]
source=ROOT/"assets/js/physics.js"
commit=subprocess.check_output(["git","rev-parse","HEAD"],cwd=ROOT,text=True).strip()
payload={
    "schema_version":"1.0.0","generated":"2026-08-03","precision_decimal_digits":60,
    "metric":"ds²=-D²c²dt²+D⁻²dr²+r²dΩ²; D=(1+Xi)⁻¹",
    "canonical_bridge":"derivative-matched quintic Hermite C²",
    "canonical":canonical,
    "sensitivity":{
        "variant_count":len(variants),"variants":variants,
        "photon_candidate_range":[mp.nstr(min(photon_values),30),mp.nstr(max(photon_values),30)],
        "critical_impact_range":[mp.nstr(min(impact_values),30),mp.nstr(max(impact_values),30)],
        "interpretation":"The stationary null candidate remains inside the varied matching interval and changes with admissible higher-order bridge structure; it is matching-sensitive, not branch-intrinsic.",
    },
    "provenance":{"repository":"error-wtf/ssz-research-portal","commit_sha":commit,
                  "code_path":"scripts/build_strong_field_certificates.py",
                  "browser_engine_path":"assets/js/physics.js","browser_engine_sha256":hashlib.sha256(source.read_bytes()).hexdigest(),
                  "reproduce":"python3 scripts/build_strong_field_certificates.py"},
    "limitations":["Static spherical diagonal metric only","No rotation, plasma or radiative transfer",
                   "Stationary effective-potential candidates are not observations","Variants are a structured sensitivity sample, not an exhaustive space of C² completions"],
}
(ROOT/"data/strong-field-certificates.json").write_text(json.dumps(payload,indent=2)+"\n")
print("built strong-field certificates:",len(variants),"sensitivity variants")
