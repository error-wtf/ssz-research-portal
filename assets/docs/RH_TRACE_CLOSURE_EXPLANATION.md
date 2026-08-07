# Trace terminology and canonical closure

This note prevents a recurring reviewer misunderstanding.

## The historical negative control

The repository contains an exploratory one-sided diagnostic based on

$$
\int_0^\infty e^{i\alpha x}\theta(x)\,dx
=
\int_0^\infty\cos(\alpha x)\theta(x)\,dx
+i\int_0^\infty\sin(\alpha x)\theta(x)\,dx.
$$

An even-profile Xi condition controls the corresponding full cosine transform;
it does not, by itself, provide an unrestricted bound for the one-sided sine
transform. That diagnostic is deliberately retained as a negative control. It
is not an assumption and it is not a dependency of the canonical route.

## The canonical two-sided route

For \(0<\operatorname{Im}\alpha<\tfrac12\), the two improper Volterra tails

$$
u_-^\alpha(x)=e^{-i\alpha x}\int_{-\infty}^{x}e^{i\alpha y}\theta(y)\,dy,
\qquad
u_+^\alpha(x)=-e^{-i\alpha x}\int_{x}^{\infty}e^{i\alpha y}\theta(y)\,dy
$$

are first shown to converge absolutely under the stated source majorant.
Subtracting the two actual integrals, with the same normalization, gives

$$
u_-^\alpha(x)-u_+^\alpha(x)
=e^{-i\alpha x}\int_{\mathbb R}e^{i\alpha y}\theta(y)\,dy
=e^{-i\alpha x}\Xi(\alpha).
$$

Therefore an assumed \(\Xi(\alpha)=0\) gives \(u_-^\alpha(x)=u_+^\alpha(x)\)
for every \(x\) where the tails are defined. The common first-order ODE then
gives equality of derivatives. Since

$$
F=-i(u'+\Phi'u),
$$

the complete states have equal \(F\)-components as well. Reflection by
\(t=-x\) and \(P_0=\operatorname{diag}(1,-1)\) then gives the matched
reflected origin state used by the Green calculation. This is the canonical
state-matching argument; no one-sided sine-transform inequality is invoked.

## What an independent reviewer must still check

The canonical route is an internally assembled proof candidate, not an
independently accepted theorem. Review must re-derive the Xi normalization,
verify absolute convergence for the exact profile, check local absolute
continuity, recompute the reflection and outward-normal signs, and verify that
the endpoint and positivity certificates apply with the stated quantifiers.
The phrase “trace closure” therefore refers to checking this actual reflected
state-and-flux chain, not to silently promoting the historical one-sided
diagnostic to a theorem.

