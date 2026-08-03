#!/usr/bin/env python3
"""Build reviewed public paper and observational catalogues.

This script deliberately excludes private research material.  It reads only the
public SSZ paper index and the public VO/ALMA catalogue shipped by the starmaps
repository.  Generated files contain project-relative provenance, never local
absolute paths.
"""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHYSICS = Path.home() / "physics"
PAPER_INDEX = PHYSICS / "ssz-complete-documentation/09_PAPERS/paper_index.md"
OBSERVATIONS = PHYSICS / "Segmented-Spacetime-Starmaps/multi_catalog_g79_cygnus.csv"

RESEARCHGATE = "https://www.researchgate.net/profile/Carmen-Wrede/research"
PUBLIC_LINKS = {
    "Segmented Spacetime: A Frequency-Based Framework for Gravity, Light, and Black Holes":
        "https://www.researchgate.net/publication/392363927_Segmented_Spacetime_-_A_Frequency-Based_Framework_for_Gravity_Light_and_Black_Holes",
    "Segmented Spacetime: Infalling Matter and Radiowaves":
        "https://www.researchgate.net/publication/397756840_Segmented_Spacetime_-Infalling_Matter_and_Radiowaves",
    "Dual Velocities in Segmented Spacetime: Escape, Fall, and Gravitational Redshift":
        "https://www.researchgate.net/publication/395694324_Dual_Velocities_in_Segmented_Spacetime_-_Escape_Fall_and_Gravitational_Redshift",
    "Segmented Spacetime and the Origin of Molecular Zones in Expanding Nebulae":
        "https://www.researchgate.net/publication/397386282_Segmented_Spacetime_and_the_Origin_of_Molecular_Zones_in_Expanding_Nebulae",
    "Segmented Spacetime and the Dark Star Problem":
        "https://www.researchgate.net/publication/397570946_Segmented_Spacetime_and_the_Dark_Star_Problem_-_A_Historical_and_Geometric_Reassessment_of_Light_Escape_in_Strong_Gravity",
    "Segmented Spacetime and the Natural Boundary of Black Holes: Implications for the Cosmic Censorship Conjecture":
        "https://vixra.org/pdf/2411.0074v1.pdf",
}

TOPICS = {
    "Maxwell": "electromagnetism", "Group Velocity": "electromagnetism",
    "Radiowaves": "astrophysics", "Nebulae": "astrophysics",
    "Metric": "geometry", "Singularit": "interior", "Boundary": "interior",
    "Dark Star": "strong field", "Superradiant": "strong field",
    "Redshift": "observables", "Curvature": "observables",
    "Lorentz": "relativity", "Frame Dragging": "relativity",
    "Euler": "foundations", "Structural": "foundations",
    "Temporal": "foundations", "Coherence": "foundations",
}

HISTORICAL = {
    "Segmented Spacetime: Solution to the Paradox of Singularities",
    "Segmented Spacetime and the Natural Boundary of Black Holes: Implications for the Cosmic Censorship Conjecture",
}

def topic(title: str) -> str:
    return next((value for key, value in TOPICS.items() if key.lower() in title.lower()), "foundations")

def papers() -> dict:
    rows = []
    pattern = re.compile(r"^\|\s*(\d{2})\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(\d{4})\s*\|$")
    for line in PAPER_INDEX.read_text(encoding="utf-8").splitlines():
        match = pattern.match(line)
        if not match:
            continue
        number, key, title, year = (part.strip() for part in match.groups())
        status = "historical / requires P0 correction" if title in HISTORICAL else "local index verified"
        rows.append({
            "number": int(number), "key": key, "title": title, "year": int(year),
            "authors": "Carmen N. Wrede; Lino P. Casu", "topic": topic(title),
            "status": status, "peer_review": "preprint / not established",
            "public_url": PUBLIC_LINKS.get(title, RESEARCHGATE),
            "local_source": f"09_PAPERS/markdown/paper_{number}_…",
            "scope_note": (
                "Historical claim: superseded by the P0 result that the canonical diagonal "
                "continuation has divergent central curvature."
                if title in HISTORICAL else
                "Catalogue entry; scientific claims must be evaluated against current canonical documentation and tests."
            ),
        })
    return {
        "status": "reviewed local bibliography with partial public-link verification",
        "count": len(rows),
        "profile_reported_count": 26,
        "count_warning": "The public profile and local canonical index use different counting rules; no total is presented as exact without item-level reconciliation.",
        "source": "ssz-complete-documentation/09_PAPERS/paper_index.md",
        "profile": RESEARCHGATE,
        "papers": rows,
    }

def observations() -> dict:
    selected, seen = [], set()
    with OBSERVATIONS.open(encoding="utf-8-sig", newline="", errors="replace") as handle:
        for row in csv.DictReader(handle):
            try:
                ra, dec = float(row.get("s_ra", "")), float(row.get("s_dec", ""))
            except ValueError:
                continue
            key = (row.get("target_name", ""), round(ra, 5), round(dec, 5), row.get("facility_name", ""))
            if key in seen:
                continue
            seen.add(key)
            selected.append({
                "target": row.get("target_name") or row.get("objName") or "unnamed target",
                "ra_deg": ra, "dec_deg": dec,
                "facility": row.get("facility_name") or row.get("catalog") or "catalogue",
                "instrument": row.get("instrument_name") or "not stated",
                "data_product": row.get("dataproduct_type") or "not stated",
                "observation_id": row.get("obs_id") or "",
                "publication": row.get("pub_title") or "",
                "first_author": row.get("first_author") or "",
                "year": row.get("publication_year") or "",
                "access_url": row.get("access_url") or "",
            })
            if len(selected) >= 240:
                break
    return {
        "status": "observational catalogue subset; no SSZ transformation applied",
        "count": len(selected),
        "coordinate_frame": "ICRS degrees as supplied by source catalogue",
        "source": "Segmented-Spacetime-Starmaps/multi_catalog_g79_cygnus.csv",
        "objects": selected,
    }

def formulas() -> dict:
    """Curated equations only; extraction candidates remain a separate dataset."""
    rows = [
        ("rs", "Schwarzschild length scale", r"r_s = 2GM/c^2", "geometry", "m", "M > 0", "Defines the radial normalization; it does not itself assert a Schwarzschild metric."),
        ("x", "Normalized radius", r"x = r/r_s", "geometry", "1", "r_s > 0", "Dimensionless coordinate used by the branch functions."),
        ("phi", "Golden ratio", r"\varphi = (1+\sqrt{5})/2", "foundations", "1", "constant", "A declared SSZ model parameter in the strong branch, not an empirical fit result by itself."),
        ("xi-strong", "Strong branch", r"\Xi_s(x)=1-\exp(-\varphi/x)", "field", "1", "0 < x < 1.8", "Canonical P0 strong branch."),
        ("xi-weak", "Weak branch", r"\Xi_w(x)=1/(2x)", "field", "1", "x > 2.2", "Matches GM/(rc²) because r_s=2GM/c²."),
        ("blend-t", "Blend coordinate", r"t=(x-1.8)/0.4", "field", "1", "1.8 ≤ x ≤ 2.2", "Maps the transition interval to [0,1]."),
        ("blend", "Quintic Hermite bridge", r"\Xi_b(t)=\sum_{k=0}^{5}a_k t^k", "field", "1", "0 ≤ t ≤ 1", "Six coefficients match value, slope and curvature at both endpoints."),
        ("blend-conditions", "C² endpoint conditions", r"\Xi_b^{(k)}(x_i)=\Xi_i^{(k)}(x_i),\quad k=0,1,2", "field", "varies by derivative", "x_i ∈ {1.8,2.2}", "The derivatives are with respect to the same normalized coordinate."),
        ("d", "Time factor", r"D(r)=1/[1+\Xi(r)]", "metric", "1", "declared branch domain", "Maps the segment field to the static clock factor."),
        ("s", "Radial stretch", r"s(r)=1+\Xi(r)=D^{-1}(r)", "metric", "1", "declared branch domain", "Reciprocal scaling used in the diagonal ansatz."),
        ("metric", "Static spherical metric", r"ds^2=-D^2c^2dt^2+D^{-2}dr^2+r^2d\Omega^2", "metric", "m²", "static spherical effective model", "The angular radius is areal: sphere area is 4πr²."),
        ("solid-angle", "Unit-sphere line element", r"d\Omega^2=d\theta^2+\sin^2\theta\,d\phi^2", "geometry", "1", "spherical coordinates", "Angular part of the metric."),
        ("proper-time", "Static proper time", r"d\tau=D(r)\,dt", "clocks", "s", "static observer", "Not the proper time of a photon."),
        ("radial-null", "Radial null coordinate slope", r"dr/dt=\pm cD^2(r)", "null paths", "m/s", "radial ds²=0", "Coordinate slope, not locally measured light speed."),
        ("redshift-general", "Static emitter-observer redshift", r"1+z=D(r_o)/D(r_e)", "observables", "1", "static emitter and observer", "Requires both radii; z=Ξ only for an observer at infinity."),
        ("redshift-infinity", "Static redshift to infinity", r"z_\infty=D^{-1}(r_e)-1=\Xi(r_e)", "observables", "1", "D(∞)=1", "Does not include Doppler, plasma or transfer effects."),
        ("horizon-xi", "Horizon segment value", r"\Xi(r_s)=1-e^{-\varphi}\approx0.801711847", "limits", "1", "x=1", "Finite canonical P0 value."),
        ("horizon-d", "Horizon clock factor", r"D(r_s)=[2-e^{-\varphi}]^{-1}\approx0.555027709", "limits", "1", "x=1", "Finite horizon factor; not proof of a regular centre."),
        ("centre-a", "Central coefficient limit", r"A(r)=D^2(r)\to1/4", "interior", "1", "formal r→0 continuation", "Finite A does not imply finite curvature."),
        ("ricci", "Ricci leading asymptotic", r"R(r)\sim3/(2r^2)", "interior", "m⁻²", "formal r→0 continuation", "Diverges at the areal centre."),
        ("kretschmann", "Kretschmann leading asymptotic", r"K(r)\sim9/(4r^4)", "interior", "m⁻⁴", "formal r→0 continuation", "Coordinate-invariant curvature divergence."),
        ("ppn-lensing", "Leading PPN light deflection", r"\alpha=(1+\gamma)r_s/b", "weak field", "rad", "b ≫ r_s", "With γ=1 this gives 2r_s/b; not a strong-field ray trace."),
        ("shapiro", "Leading Shapiro delay", r"\Delta t=(1+\gamma)(r_s/c)\ln(4r_1r_2/d^2)", "weak field", "s", "leading conjunction geometry", "Geometry and one-way/two-way conventions must be stated."),
        ("perihelion", "Perihelion advance", r"\Delta\omega=6\pi GM/[a(1-e^2)c^2]", "weak field", "rad/orbit", "β=γ=1 weak-field limit", "Compatibility here does not validate the interior."),
        ("sagnac", "Leading Sagnac difference", r"\Delta t\approx4A\Omega/c^2", "rotation", "s", "standard rotating loop", "A is loop area here, not the metric coefficient A(r)."),
        ("null-potential", "Null circular-orbit diagnostic", r"V_{\rm null}(r)\propto D^2(r)/r^2", "strong field", "relative", "declared diagonal metric", "A maximum is a candidate circular null orbit; stability needs full analysis."),
        ("energy", "Stationary geodesic constant", r"E=-g_{tt}u^t", "geodesics", "convention dependent", "stationary metric", "A conserved geodesic quantity, not automatically locally measured energy."),
        ("angular-momentum", "Azimuthal geodesic constant", r"L=g_{\phi\phi}u^\phi", "geodesics", "convention dependent", "axisymmetry", "Used with normalization and radial equations."),
    ]
    return {
        "status": "curated current formula reference",
        "count": len(rows),
        "formulas": [
            {"id": i, "name": n, "latex": f, "topic": t, "units": u, "domain": d, "caution": c}
            for i, n, f, t, u, d, c in rows
        ],
    }

def write(name: str, payload: dict) -> None:
    (ROOT / "data" / name).write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

if __name__ == "__main__":
    write("papers.json", papers())
    write("observations.json", observations())
    write("formulas.json", formulas())
    print("built papers, observations and curated formulas")
