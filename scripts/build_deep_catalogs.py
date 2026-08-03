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
from urllib.parse import quote
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHYSICS = ROOT.parent / "physics"
PAPER_INDEX = PHYSICS / "ssz-complete-documentation/09_PAPERS/paper_index.md"
OBSERVATIONS = PHYSICS / "Segmented-Spacetime-Starmaps/multi_catalog_g79_cygnus.csv"
GAIA_STARS = PHYSICS / "Segmented-Spacetime-Starmaps/ssz_explorer/ssz_data/star_database_enriched.csv"

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

PAPER_SUMMARIES = {
    1: "Introduces a radial scaling prescription for Maxwell fields and asks how field amplitudes and flux relations transform under SSZ radial scaling.",
    2: "Develops the escape/fall dual-velocity language and its relation to static gravitational redshift. Coordinate, dual and locally measured velocities must remain distinct.",
    3: "Presents the frequency-centred overview of SSZ, connecting the segment field, clock factor and proposed black-hole phenomenology.",
    4: "States a static spherical SSZ metric proposal and discusses horizon behaviour. Current use is constrained by the P0 central-curvature correction.",
    5: "Studies infalling matter and radio-wave propagation in the effective geometry, with emphasis on observer-dependent frequency and travel-time interpretation.",
    6: "Builds a proposed chain from golden-ratio segmentation to Euler-type relations. These structural steps are model hypotheses, not consequences of the metric alone.",
    7: "Formulates a kinematic closure between escape and fall descriptions and identifies invariant or reciprocal combinations used by the programme.",
    8: "Defines a segment-based group-velocity description for propagation. Its operational meaning depends on distinguishing coordinate and local measurements.",
    9: "Revisits the historical dark-star problem through finite horizon time scaling and escape conditions in SSZ.",
    10: "Proposes curvature detection through dynamic frequency comparisons and links laboratory/astronomical clock observables to the weak-field implementation.",
    11: "Applies SSZ-inspired mappings to molecular and radio zones in expanding nebulae, especially G79.29+0.46. The interpretation remains conditional on the supplied data pipeline.",
    12: "Explores whether SSZ strong-field scaling can regulate superradiant-instability proxies. A complete perturbation theory is still required.",
    13: "Investigates φ and π as structural constants in segmentation geometry. The proposed relations are foundational hypotheses requiring independent derivation and tests.",
    14: "Proposes emergent spatial axes from orthogonal temporal interference. This is a speculative construction beyond the locked static metric.",
    15: "Connects bound-energy scaling to the fine-structure constant. Fit quality and structural interpretation must be separated from derivation.",
    16: "Discusses the singularity problem in Segmented Spacetime. A supplementary paper is planned to explain the distinction between horizon behavior and the unresolved global interior in greater detail.",
    17: "Interprets a natural black-hole boundary in relation to cosmic censorship. A supplementary paper is planned to expand the treatment of the global interior.",
    18: "Documents φ/2 and β calibration choices and their numerical role. Calibration identities are not automatically fundamental constants of nature.",
    19: "Proposes a geometric treatment of the Lorentz transformation at v=0 and discusses how local frames are embedded in segmented descriptions.",
    20: "Treats φ as a temporal growth function and motivates the strong-branch exponential. The choice remains declared model structure.",
    21: "Explains static gravitational redshift through D and Ξ, including the distinction between endpoint clock comparison and in-flight photon retuning.",
    22: "Offers a rotating-space interpretation of Maxwell waves. The picture is interpretive unless tied to a covariant electromagnetic action.",
    23: "Separates contributions to observed light-travel time and warns that geometry, propagation medium and source/observer motion must be modelled independently.",
    24: "Defines local Lorentz invariance through transformations and relates the construction to frame-dragging language. A rotating global SSZ solution remains open.",
    25: "Proposes an irreversible coherence-collapse transition between two regimes. It is not part of the public canonical static metric lock.",
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
        number_int = int(number)
        status = "supplementary explanation planned" if title in HISTORICAL else "local index verified"
        manuscripts = sorted((PAPER_INDEX.parent / "markdown").glob(f"paper_{number}_*.md"))
        manuscript_name = manuscripts[0].name if manuscripts else ""
        manuscript_url = (
            "https://github.com/error-wtf/ssz-complete-documentation/blob/main/"
            f"09_PAPERS/markdown/{quote(manuscript_name)}"
            if manuscript_name else ""
        )
        rows.append({
            "number": number_int, "key": key, "title": title, "year": int(year),
            "authors": "Carmen N. Wrede; Lino P. Casu", "topic": topic(title),
            "status": status, "peer_review": "preprint / not established",
            "public_url": PUBLIC_LINKS.get(title, ""),
            "manuscript_url": manuscript_url,
            "local_source": f"09_PAPERS/markdown/{manuscript_name}",
            "summary": PAPER_SUMMARIES[number_int],
            "scope_note": (
                "Supplementary explanation planned; the portal's current interior page "
                "provides the presently applicable mathematical scope."
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

def starmap_stars() -> dict:
    """Select a deterministic magnitude-sorted subset of the repository's Gaia cache."""
    stars = []
    with GAIA_STARS.open(encoding="utf-8-sig", newline="", errors="replace") as handle:
        for row in csv.DictReader(handle):
            try:
                ra = float(row["ra"])
                dec = float(row["dec"])
                distance = float(row["distance_pc"])
                magnitude = float(row["phot_g_mean_mag"])
            except (KeyError, TypeError, ValueError):
                continue
            if not (0 <= ra <= 360 and -90 <= dec <= 90 and distance > 0):
                continue
            def optional(name: str):
                try:
                    value = float(row.get(name, ""))
                    return value if value == value else None
                except (TypeError, ValueError):
                    return None
            stars.append({
                "source_id": str(row.get("source_id", "")),
                "ra_deg": round(ra, 8),
                "dec_deg": round(dec, 8),
                "parallax_mas": optional("parallax"),
                "pmra_mas_yr": optional("pmra"),
                "pmdec_mas_yr": optional("pmdec"),
                "g_mag": round(magnitude, 5),
                "bp_rp": optional("bp_rp"),
                "distance_pc": round(distance, 6),
                "temperature_k": optional("temperature_K"),
                "temperature_source": row.get("temperature_source", ""),
            })
    stars.sort(key=lambda item: (item["g_mag"], item["source_id"]))
    stars = stars[:3000]
    return {
        "status": "public local Gaia-derived cache; legacy SSZ columns intentionally excluded",
        "count": len(stars),
        "coordinate_frame": "ICRS",
        "distance_method": "repository-provided inverse-parallax distance field",
        "source": "Segmented-Spacetime-Starmaps/ssz_explorer/ssz_data/star_database_enriched.csv",
        "guardrail": "The source cache's legacy Xi and D columns are not used because they do not match the current P0 piecewise model.",
        "stars": stars,
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
        ("metric-a", "Temporal metric coefficient", r"A(r)=D^2(r)", "metric", "1", "static diagonal ansatz", "A is not an independently fitted field."),
        ("metric-b", "Radial metric coefficient", r"B(r)=D^{-2}(r)", "metric", "1", "static diagonal ansatz", "The identity A·B=1 is specific to this ansatz."),
        ("inverse-metric", "Inverse metric", r"g^{\mu\nu}=\operatorname{diag}[-1/(D^2c^2),D^2,r^{-2},(r^2\sin^2\theta)^{-1}]", "metric", "component dependent", "D ≠ 0 and spherical chart", "Coordinate components must not be interpreted as local measurements."),
        ("metric-determinant", "Metric determinant", r"\det g=-c^2r^4\sin^2\theta", "metric", "coordinate dependent", "static diagonal ansatz", "Its simple D cancellation does not establish central regularity."),
        ("metric-volume", "Invariant coordinate-volume density", r"\sqrt{-g}=c\,r^2|\sin\theta|", "metric", "coordinate density", "diagonal spherical chart and D·s=1", "A simple volume density does not imply finite curvature."),
        ("static-coframe", "Static orthonormal coframe", r"\vartheta^{\hat0}=Dc\,dt,\ \vartheta^{\hat1}=s\,dr,\ \vartheta^{\hat2}=r\,d\theta,\ \vartheta^{\hat3}=r\sin\theta\,d\phi", "local frames", "length", "static diagonal chart", "The static frame is an operational basis, not a freely falling frame."),
        ("flow-gamma", "Flow-form gamma field", r"\gamma(r)=1+\Xi(r)=D^{-1}(r)", "metric forms", "1", "canonical pure metric mapping", "The repository calls this gamma; its physical interpretation must follow the declared coordinate construction."),
        ("flow-beta", "Flow-form beta field", r"\beta(r)=\sqrt{1-\gamma^{-2}(r)}=\sqrt{1-D^2(r)}", "metric forms", "1", "γ ≥ 1", "This derived coordinate-flow parameter is not automatically a material velocity."),
        ("flow-metric", "Non-diagonal flow metric", r"ds^2=-c^2(1-\beta^2)dt^2+2\beta c\,dt\,dr+dr^2+r^2d\Omega^2", "metric forms", "length²", "repository flow coordinate form", "A cross term does not by itself establish rotation or a global chart equivalence."),
        ("flow-null-slopes", "Flow-form radial null slopes", r"dr/(c\,dt)=-\beta\pm1", "null paths", "1", "radial null curve in flow chart", "These are coordinate slopes; local light speed remains c."),
        ("proper-radius", "Proper radial length", r"\ell=\int_{r_1}^{r_2}dr/D(r)", "measurements", "m", "constant-t spatial slice", "This is slice dependent and is not infall proper time."),
        ("null-time", "Radial null travel time", r"\Delta t=c^{-1}\int_{r_1}^{r_2}dr/D^2(r)", "null paths", "s", "radial null curve in static chart", "A coordinate travel time, not a variable local light speed."),
        ("strong-first", "Strong-branch first derivative", r"\Xi_s'(x)=-(\varphi/x^2)e^{-\varphi/x}", "field", "1", "x > 0", "Derivative is with respect to normalized radius x."),
        ("strong-second", "Strong-branch second derivative", r"\Xi_s''(x)=e^{-\varphi/x}(2\varphi/x^3-\varphi^2/x^4)", "field", "1", "x > 0", "Used in the left endpoint C² match."),
        ("weak-first", "Weak-branch first derivative", r"\Xi_w'(x)=-1/(2x^2)", "field", "1", "x > 0", "Used in the right endpoint C² match."),
        ("weak-second", "Weak-branch second derivative", r"\Xi_w''(x)=1/x^3", "field", "1", "x > 0", "Used in the right endpoint C² match."),
        ("hermite-left-value", "Quintic Hermite left-value basis", r"h_{00}=1-10t^3+15t^4-6t^5", "field", "1", "0 ≤ t ≤ 1", "One of six endpoint-interpolation basis functions."),
        ("hermite-left-slope", "Quintic Hermite left-slope basis", r"h_{10}=t-6t^3+8t^4-3t^5", "field", "1", "0 ≤ t ≤ 1", "Multiplied by interval width and left slope."),
        ("hermite-left-curvature", "Quintic Hermite left-curvature basis", r"h_{20}=(t^2-3t^3+3t^4-t^5)/2", "field", "1", "0 ≤ t ≤ 1", "Multiplied by interval width squared and left curvature."),
        ("hermite-right-value", "Quintic Hermite right-value basis", r"h_{01}=10t^3-15t^4+6t^5", "field", "1", "0 ≤ t ≤ 1", "One of six endpoint-interpolation basis functions."),
        ("hermite-right-slope", "Quintic Hermite right-slope basis", r"h_{11}=-4t^3+7t^4-3t^5", "field", "1", "0 ≤ t ≤ 1", "Multiplied by interval width and right slope."),
        ("hermite-right-curvature", "Quintic Hermite right-curvature basis", r"h_{21}=(t^3-2t^4+t^5)/2", "field", "1", "0 ≤ t ≤ 1", "Multiplied by interval width squared and right curvature."),
        ("christoffel", "Levi-Civita connection", r"\Gamma^\rho_{\mu\nu}=\tfrac12g^{\rho\sigma}(\partial_\mu g_{\sigma\nu}+\partial_\nu g_{\sigma\mu}-\partial_\sigma g_{\mu\nu})", "differential geometry", "coordinate dependent", "metric-compatible torsion-free connection", "Connection components can be chart singular even when invariants are finite."),
        ("riemann", "Riemann tensor", r"R^\rho_{\ \sigma\mu\nu}=\partial_\mu\Gamma^\rho_{\nu\sigma}-\partial_\nu\Gamma^\rho_{\mu\sigma}+\Gamma^\rho_{\mu\lambda}\Gamma^\lambda_{\nu\sigma}-\Gamma^\rho_{\nu\lambda}\Gamma^\lambda_{\mu\sigma}", "differential geometry", "m⁻²", "Levi-Civita connection", "Sign depends on the declared curvature convention."),
        ("einstein", "Einstein tensor", r"G_{\mu\nu}=R_{\mu\nu}-\tfrac12Rg_{\mu\nu}", "differential geometry", "m⁻²", "declared metric and sign convention", "A geometric diagnostic here, not a derived SSZ equation of motion."),
        ("effective-source", "Effective stress tensor diagnostic", r"T_{\mu\nu}^{\rm eff}=G_{\mu\nu}/(8\pi G)", "dynamics", "stress-energy", "GR-style diagnostic convention", "Does not supply a fundamental SSZ matter action."),
        ("geodesic", "Geodesic equation", r"d^2x^\mu/d\lambda^2+\Gamma^\mu_{\alpha\beta}(dx^\alpha/d\lambda)(dx^\beta/d\lambda)=0", "geodesics", "coordinate dependent", "affine parameter λ", "Applies to free test trajectories in the effective geometry."),
        ("four-velocity", "Timelike normalization", r"g_{\mu\nu}u^\mu u^\nu=-c^2", "geodesics", "m²/s²", "timelike worldline", "Null trajectories instead have zero norm."),
        ("null-turning", "Null turning-point impact parameter", r"b^2=r_{\rm turn}^2/A(r_{\rm turn})", "strong field", "m²", "equatorial null geodesic", "A turning point is not automatically a circular orbit."),
        ("photon-condition", "Circular null-orbit condition", r"d[A(r)/r^2]/dr=0", "strong field", "m⁻³", "static spherical metric", "Stability follows from the second derivative and global accessibility."),
        ("clock-ratio", "Static clock-rate ratio", r"d\tau_1/d\tau_2=D(r_1)/D(r_2)", "clocks", "1", "static clocks compared in one stationary chart", "Transport and kinematic effects require a fuller protocol."),
        ("weak-xi", "Weak-field potential correspondence", r"\Xi_w=GM/(rc^2)", "weak field", "1", "r > 2.2r_s", "Follows algebraically from r_s=2GM/c²."),
        ("weak-d", "Weak-field time-factor expansion", r"D=(1+\Xi)^{-1}=1-\Xi+\Xi^2+O(\Xi^3)", "weak field", "1", "|Ξ| < 1", "A local series; observable calculations still need the full metric."),
        ("residual", "Normalized residual", r"\rho_i=[y_i-f(x_i;\theta)]/\sigma_i", "data analysis", "1", "independent Gaussian uncertainty", "Correlated measurements require a covariance matrix."),
        ("chi-square", "Correlated chi-square", r"\chi^2=(\mathbf y-\mathbf f)^T C^{-1}(\mathbf y-\mathbf f)", "data analysis", "1", "specified covariance C", "Model comparison must also address parameters, priors and selection effects."),
        ("curvature-dimensions", "Curvature dimensional check", r"[R]=L^{-2},\qquad[K]=L^{-4}", "validation", "m⁻² and m⁻⁴", "geometric units restored consistently", "A required sanity check for central asymptotics."),
        ("strong-limit", "Strong-branch central field limit", r"\lim_{x\to0^+}\Xi_s(x)=1", "limits", "1", "formal inner continuation", "This is a field limit, not proof that the centre belongs to a regular manifold."),
        ("d-centre", "Central clock-factor limit", r"\lim_{x\to0^+}D(x)=1/2", "limits", "1", "formal inner continuation", "Finite D does not imply finite curvature."),
        ("asymptotic-flat", "Asymptotic flatness checkpoint", r"\lim_{x\to\infty}\Xi=0,\quad\lim_{x\to\infty}D=1", "limits", "1", "weak branch", "An asymptotic limit does not determine the global interior."),
        ("strong-weak-intersection", "Raw branch intersection", r"1-e^{-\varphi/x_\times}=1/(2x_\times)", "regimes", "1", "comparison of unblended branch formulas", "The raw intersection is not one of the declared bridge endpoints."),
        ("hermite-complete", "Complete C² bridge", r"H_5=h_{00}y_0+h h_{10}y'_0+h^2h_{20}y''_0+h_{01}y_1+h h_{11}y'_1+h^2h_{21}y''_1", "regimes", "1", "1.8 ≤ x ≤ 2.2", "Every derivative is taken with respect to the same normalized coordinate x."),
        ("d-first", "Clock-factor derivative", r"D'=-\Xi'/(1+\Xi)^2", "metric", "inverse length or 1 in x", "differentiable branch", "Derivative units depend on whether the independent variable is r or x."),
        ("a-first", "Temporal coefficient derivative", r"A'=2DD'", "metric", "inverse length or 1 in x", "A=D²", "Used in circular-orbit diagnostics."),
        ("b-first", "Radial coefficient derivative", r"B'=-2D^{-3}D'", "metric", "inverse length or 1 in x", "B=D⁻²", "Large coordinate coefficients are not by themselves invariant singularities."),
        ("static-tetrad-time", "Static orthonormal time leg", r"e_{\hat 0}=D^{-1}c^{-1}\partial_t", "local frames", "inverse length", "D>0, static observer", "Defines a local frame only where a static observer is physically admissible."),
        ("static-tetrad-radial", "Static orthonormal radial leg", r"e_{\hat r}=D\,\partial_r", "local frames", "inverse length", "D>0", "Separates local radial measurements from coordinate components."),
        ("four-acceleration", "Static-observer radial acceleration", r"a^{\hat r}=c^2D'(r)", "local frames", "m/s²", "static diagonal ansatz and proper radial frame", "Sign and interpretation depend on derivative convention and observer choice."),
        ("lagrangian", "Geodesic Lagrangian", r"2\mathcal L=g_{\mu\nu}\dot x^\mu\dot x^\nu", "geodesics", "velocity squared", "affinely parametrised trajectory", "An effective test-particle Lagrangian is not the missing fundamental field action."),
        ("radial-timelike", "Timelike radial equation", r"\dot r^2=E^2/c^2-A(r)\left(c^2+L^2/r^2\right)", "geodesics", "m²/s²", "equatorial timelike geodesic; convention-dependent E and L", "Must be re-derived if the metric convention changes."),
        ("radial-null-effective", "Null radial equation", r"\dot r^2=E^2/c^2-A(r)L^2/r^2", "geodesics", "m²/s²", "equatorial null geodesic", "Turning points and circular orbits are different conditions."),
        ("photon-stability", "Null-orbit stability diagnostic", r"d^2[A(r)/r^2]/dr^2\lessgtr0", "strong field", "m⁻⁴", "at a stationary null orbit", "The sign convention must be matched to the chosen effective potential."),
        ("orbital-frequency", "Circular-orbit coordinate frequency", r"\Omega^2=c^2A'(r)/(2r)", "geodesics", "s⁻²", "static spherical metric in areal radius", "Coordinate frequency requires conversion before comparison with a local clock."),
        ("timelike-angular-momentum", "Circular timelike angular momentum", r"L^2=c^2r^3A'/(2A-rA')", "geodesics", "m⁴/s² under specific convention", "circular timelike orbit", "Denominator and normalization conventions must be checked."),
        ("timelike-energy", "Circular timelike energy", r"E^2=2c^4A^2/(2A-rA')", "geodesics", "energy-per-mass squared", "circular timelike orbit", "Stability requires a separate second-derivative condition."),
        ("isco-condition", "Marginal orbit stability", r"d^2V_{\rm eff}/dr^2=0", "strong field", "potential per length²", "on a circular timelike solution", "Solving this condition is metric- and branch-specific."),
        ("shadow-impact", "Critical shadow impact parameter", r"b_{\rm crit}=r_{\rm ph}/\sqrt{A(r_{\rm ph})}", "strong field", "m", "accessible unstable circular null orbit", "A shadow observable additionally needs source, inclination, transfer and rotation."),
        ("redshift-two-static", "Two-radius frequency ratio", r"\nu_o/\nu_e=D(r_e)/D(r_o)", "observables", "1", "static emitter and observer", "Inverse placement of emitter and observer changes the reported z convention."),
        ("doppler-factor", "Special-relativistic line-of-sight Doppler factor", r"\delta=[\gamma(1-\beta\cos\vartheta)]^{-1}", "observables", "1", "local inertial comparison", "This kinematic factor is separate from static gravitational scaling."),
        ("observed-frequency", "Combined schematic frequency map", r"\nu_{\rm obs}=\nu_{\rm emit}[D_e/D_o]\,\delta\,\mathcal T", "observables", "Hz", "declared transfer factor T", "The transfer factor is model-dependent; this is a bookkeeping relation, not a universal closed formula."),
        ("ppn-gtt", "PPN temporal metric expansion", r"g_{tt}/c^2=-1+2U/c^2-2\beta U^2/c^4+O(c^{-6})", "weak field", "1", "|U|/c² ≪ 1", "The sign of U must follow the declared PPN convention."),
        ("ppn-gij", "PPN spatial metric expansion", r"g_{ij}=[1+2\gamma U/c^2+O(c^{-4})]\delta_{ij}", "weak field", "1", "weak quasi-static field", "A coordinate-gauge statement used for specific observable calculations."),
        ("energy-density", "Effective density projection", r"\rho_{\rm eff}=T^{\rm eff}_{\hat0\hat0}/c^2", "energy conditions", "kg/m³", "chosen orthonormal frame", "Effective-source diagnostics are not fundamental SSZ matter content."),
        ("wec", "Weak energy condition", r"\rho\ge0,\qquad \rho+p_i/c^2\ge0", "energy conditions", "energy density", "orthonormal principal frame", "A diagnostic condition; violations do not alone select or reject an effective geometry."),
        ("dec", "Dominant energy condition", r"\rho\ge|p_i|/c^2", "energy conditions", "energy density", "orthonormal principal frame", "Requires a physically interpreted effective source."),
        ("sec", "Strong energy condition", r"\rho+\sum_i p_i/c^2\ge0,\quad \rho+p_i/c^2\ge0", "energy conditions", "energy density", "orthonormal principal frame", "Its relevance depends on the underlying dynamical theory."),
        ("binomial-sign", "Two-sided paired sign-test probability", r"p=2\sum_{k=0}^{\min(w,n-w)}{n\choose k}2^{-n}", "statistics", "1", "independent exchangeable paired signs under the null", "Does not account for model flexibility, selection or correlated pairs."),
        ("confidence-interval", "Bootstrap percentile interval", r"CI_{1-\alpha}=[Q_{\alpha/2}(\hat\theta^*),Q_{1-\alpha/2}(\hat\theta^*)]", "statistics", "same as estimator", "representative resampling scheme", "Bootstrap validity depends on sampling structure and independence assumptions."),
        ("bic", "Bayesian information criterion", r"\mathrm{BIC}=k\ln n-2\ln\hat L", "statistics", "1", "regular likelihood and sample-size assumptions", "Lower BIC is an asymptotic model-selection heuristic, not proof."),
        ("aic", "Akaike information criterion", r"\mathrm{AIC}=2k-2\ln\hat L", "statistics", "1", "maximum likelihood comparison", "Relative predictive criterion; absolute fit and data quality remain separate."),
        ("sagnac-integral", "Stationary-spacetime Sagnac integral", r"\Delta t=-2c^{-1}\oint g_{0i}/g_{00}\,dx^i", "rotation", "s", "stationary metric and declared coordinates", "The leading 4AΩ/c² formula follows only in its controlled rotating-loop limit."),
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
    write("starmap-stars.json", starmap_stars())
    write("formulas.json", formulas())
    print("built papers, observations, Gaia starmap and curated formulas")
