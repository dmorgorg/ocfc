<script>
	import Card from "./Card.svelte";
	import { fade } from "svelte/transition";
	import { ki, kd, fluids, utils, tri } from "$lib/utilities";

	let sdigs = 3,
		wdigs = 6,
		validS = true,
		extraDig = true,
		extraWorkingDig = true;

	
	const sdw = (num) => {
		return utils.sd(num, wdigs, extraWorkingDig);
	};

	const sds = (num) => {
		return utils.sd(num, sdigs, extraDig);
	};
	

	// variables ending in s are string inputs, bound to numerical input fields
	let ys = 1.4,
		zls = 1,
		zrs = 1,
		ss = 0.1,
		ns = 0.013,
		gs = 9.81;
	// inputs
	$: y = sdw(ys, sdigs, extraDig);
	$: zl = sdw(zls, sdigs, extraDig);
	$: zr = sdw(zrs, sdigs, extraDig);
	$: n = Number(sdw(ns, sdigs, extraDig));
	$: s = Number(sdw(ss, sdigs, extraDig));
	$: g = Number(sdw(gs, sdigs, extraDig));
	// calculations for y specified
	$: A = sdw(tri.getArea(y, zl, zr), wdigs, extraWorkingDig);
	$: P = sdw(tri.getP(y, zl, zr), wdigs, extraWorkingDig);
	$: R = sdw(fluids.getR(A, P), wdigs, extraWorkingDig);
	$: v = sdw(fluids.getV(n, R, s), wdigs, extraWorkingDig);
	$: Q = sdw(fluids.getQfromAandV(A, v), wdigs, extraWorkingDig);
	$: E = sdw(fluids.getE(y, v, g), wdigs, extraWorkingDig);
	$: T = sdw(tri.getT(y, zl, zr), wdigs, extraWorkingDig);
	$: NF = sdw(fluids.getNF(v, A, T, g), wdigs, extraWorkingDig);
	$: yc = sdw(tri.getYc(Q, zl, zr, g), wdigs, extraWorkingDig);
	$: Ac = sdw(tri.getArea(yc, zl, zr), wdigs, extraWorkingDig);
	$: vc = sdw(fluids.getVfromQandA(Q, Ac), wdigs, extraWorkingDig);
	$: Emin = sdw(fluids.getE(yc, vc, g), wdigs, extraWorkingDig);
	$: Pc = sdw(tri.getP(yc, zl, zr), wdigs, extraWorkingDig);
	$: Rc = sdw(fluids.getR(Ac, Pc), wdigs, extraWorkingDig);
	$: Sc = sdw(fluids.getCriticalSlope(n, vc, Rc), wdigs, extraWorkingDig);
</script>

<article>
	<section class="fig">
		<div class="width85">
			<img src="/ocfc/triangularChannelSection.png" alt="triangular channel section" />
			<img class="super" src="/ocfc/triangularChannelSectionY.png" alt="triangular channel section by depth" />
		</div>
		<form>
			<label class="zl">
				{@html ki(`\\large z_L=`)}
				<input type="number" step="any" bind:value={zls} />
			</label>
			<label class="zr">
				{@html ki(`\\large z_R=`)}
				<input type="number" step="any" bind:value={zrs} />
			</label>

			<label class="y">
				{@html ki(`\\large y=`)}
				<input type="number" step="any" bind:value={ys} />
				{@html ki(`\\textsf{m}`)}
			</label>
		</form>

		<form>
			<div class="lower-inputs">
				<label class="slope">
					{@html ki(`\\large S=`)}
					<input type="number" step="any" required bind:value={ss} />
					{@html ki(`\\small\\%`)}
				</label>

				<label class="n">
					Manning's {@html ki(`\\large n=`)}
					<input type="number" step="any" required bind:value={ns} />
				</label>

				<label class="g">
					{@html ki(`\\large g=`)}
					<input type="number" step="any" required bind:value={gs} />
					{@html ki(`\\small \\mathsf{ m/s^2 }`)}
				</label>
			</div>
		</form>
	</section>

	<section class="results">
		{#if !validS}
			need a slope
		{:else}
			<section class="normal">
				<h1>Normal (Uniform) Flow</h1>
				<Card
					answer="Flow Area: {ki(`A = ${sds(A, sdigs, extraDig)}\\, \\mathsf{m^2}`)}"
					solution={kd(`
						\\begin{aligned}
							A &= \\frac{\\left(z_L\\cdot y\\right) y}{2} + \\frac{\\left(z_R y\\right)\\cdot y}{2} \\\\
							&= \\frac{\\left(z_L+z_R\\right)y^2}{2} \\\\
							&= \\frac{\\left(${zl}+${zr}\\right)\\left(${y}\\, \\mathsf{m}\\right)^2}{2} \\\\\\\\
							A &= ${A}\\, \\mathsf{m^2}
						\\end{aligned}
					`)} />

				<Card
					answer="Wetted Perimeter: {ki(`P = ${sds(P, sdigs, extraDig)}\\, \\mathsf{m}`)}"
					solution={kd(`
						\\begin{aligned}
							P &= \\sqrt{y^2+(z_L\\!\\cdot\\!y)^2} + \\sqrt{y^2+(z_R\\!\\cdot\\!y)^2} \\\\
								&= \\left(\\sqrt{(1+z_L^2)} + \\sqrt{(1+z_R^2)}\\right)\\cdot y \\\\
								&= \\left(\\sqrt{1+(${zl})^2} + \\sqrt{1+(${zr})^2}\\right)\\cdot ${y}\\, \\mathsf{m} \\\\\\\\
							
							P &= ${P}\\, \\mathsf{m}
						\\end{aligned}
					`)} />
				<Card
					answer="Hydraulic Radius: {ki(`R = ${sds(R, sdigs, extraDig)}\\, \\mathsf m`)}  "
					solution={kd(`
						\\begin{aligned}
							R &= A/P \\\\
							&= \\frac{${A}\\, \\mathsf{m^2}}{ ${P}\\, \\mathsf{m}} \\\\\\\\
							R&= ${R} \\mathsf{m}
						\\end{aligned}
					`)} />
				<Card
					answer="Average Flow Velocity: {ki(`v = ${sds(v, sdigs, extraDig)}\\, \\mathsf{m/s}`)}  "
					solution={kd(`
						\\begin{aligned}
							v &= \\frac 1n R^{2/3} S^{1/2} \\\\
							&= \\frac{1}{${n}} \\left(${R}\\right)^{2/3} \\left(${s / 100}\\right)^{1/2} \\\\\\\\
							v &= ${v} \\, \\mathsf{m/s}
						\\end{aligned}
					`)} />
				<Card
					answer="Flow Rate: {ki(`Q = ${sds(Q, sdigs, extraDig)}\\, \\mathsf{m^3/s}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               Q &= Av \\\\
							   &= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\\\\\
							   Q &= ${Q} \\, \\mathsf{m^3/s}
                            \\end{aligned}
                        `)} />
				<Card
					answer="Specific Energy: {ki(`E = ${sds(E, sdigs, extraDig)}\\, \\mathsf{m}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               E &= y+\\frac{v^2}{2g} \\\\
							   &= ${y}\\, \\mathsf{m}+\\frac{(${v} \\, \\mathsf{m/s)^2} }
							   		{2(${g}\\, \\mathsf{m/s^2}) } \\\\\\\\
							   E &= ${E}\\,\\mathsf{m}
                            \\end{aligned}
                        `)} />
				<Card
					answer="Free Surface: {ki(`T = ${sds(T, sdigs, extraDig)}\\, \\mathsf{m}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               	T &= z_L\\!\\cdot\\!y + z_R\\!\\cdot\\!y \\\\
                            	&= (z_L + z_R)\\!\\cdot\\!y \\\\
                                &= (${zl}\\, \\mathsf{m} + ${zr}\\, \\mathsf{m})\\!\\cdot\\!${y}\\, \\mathsf{m} \\\\\\\\
								T &= ${T}\\, \\mathsf{m}
							  
							   
                            \\end{aligned}
                        `)} />
				<Card
					answer="Froude Number: {ki(`N_F = ${sds(NF, sdigs, extraDig)}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
							   &=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sdw(
						A,
						wdigs,
						extraWorkingDig
					)}\\, \\mathsf{m^2}/${sds(T)}\\, \\mathsf{m})}} \\\\\\\\
							   N_F &= ${sdw(NF, wdigs, extraWorkingDig)}
                            \\end{aligned}
                        `)} />
			</section>
			<section>
				<h1>Critical Flow</h1>

				<Card
					answer="For the {ki(`Q=${sdw(Q, wdigs, extraWorkingDig)} \\, \\mathsf{m^3\\!/s}`)} above, Critical Depth {ki(
						`y_c=${sds(yc)} \\, \\mathsf{m}`
					)}"
					solution={kd(`
                            \\begin{aligned}
								A &=  \\frac{(z_L+z_R)y^2}{2} \\\\
		s						T &= (z_L+z_R)y \\\\\\\\

								N_F &= 1 \\\\
								\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
								\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
								\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\
								\\Rightarrow \\frac{Q^2}{g} &= \\frac{(\\frac{(z_L+z_R)y_c^2}{2})^3}{(z_L+z_R)\\cdot y_c} \\\\
								&= \\frac{(z_L+z_R)^2}{2^3}\\cdot y_c^5 \\\\

								y_c^5 &= \\frac{Q^2}{g}\\cdot \\frac{8}{(z_L+z_R)^2} \\\\
								y_c^5 &= \\frac{(${Q}\\, \\mathsf{m^3\\!/s})^2}{${g}\\, \\mathsf{m/s^2}}\\cdot \\frac{8}{(${zl}+${zr})^2} \\\\
								y_c &= \\left[\\frac{(${Q}\\, \\mathsf{m^3\\!/s})^2}{${g}\\, \\mathsf{m/s^2}}\\cdot \\frac{8}{(${zl}+${zr})^2}\\right]^{0.2}	\\\\\\\\								
								y_c &= ${yc}\\, \\mathsf{m}
                            \\end{aligned}
                        `)}
						/>
				<Card
					answer="Critical Velocity: {ki(` v_c = ${sds(vc, sdigs, extraDig)}  \\,\\mathsf{m/s}`)}  "
					solution={kd(`
							\\begin{aligned}
								A_c &= \\frac{\\left(z_L+z_R\\right)y_c^2}{2} \\\\
								&= \\frac{\\left(${zl}+${zr}\\right)(${yc}\\, \\mathsf{m})^2}{2} \\\\
								&= ${Ac}\\, \\mathsf{m^2} \\\\
								
								
								v_c &= Q/A_c \\\\
								&= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\\\\\
								v_c &= ${vc}\\, \\mathsf{m/s}
								
							\\end{aligned}	`)} />
				<Card
					answer="Minimum Specific Energy: {ki(`E_{min} = ${sds(Emin, sdigs, extraDig)}\\, \\mathsf{m}`)}"
					solution={kd(`
							\\begin{aligned}
								E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
								&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\\\\\
								E_{min} &= ${Emin} \\,\\mathsf{m}
							\\end{aligned}
						`)} />
				<Card
					answer="Slope for Critical Flow: {ki(`S_c = ${sds(Sc, sdigs, extraDig)}\\%`)}"
					solution={kd(`
							\\begin{aligned}
								A_c &= \\frac{\\left(z_L+z_R\\right)y_c^2}{2} \\\\
								&= \\frac{\\left(${zl}+${zr}\\right)(${yc}\\, \\mathsf{m})^2}{2} \\\\
								&= ${Ac}\\, \\mathsf{m^2} \\\\

								P_c &= \\left(\\sqrt{1+z_L^2}+\\sqrt{1+z_R^2} \\right)y_c \\\\
								&= \\left(\\sqrt{1+(${zl})^2}+\\sqrt{1+(${zr})^2} \\right)(${yc}\\, \\mathsf{m}) \\\\								
								&= ${Pc}\\, \\mathsf{m}\\\\\\\\

								R_c &= A_c/P_c \\\\
								&= \\frac{${Ac}\\, \\mathsf{m^2}}{${Pc}\\, \\mathsf{m}} \\\\
								&= ${Rc}\\,\\mathsf{m}\\\\\\\\

								\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
								&= \\left(\\frac{${n}\\times ${vc}\\, \\mathsf{m/s} }{ (${Rc}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
								&= ${Sc / 100} \\\\
								&= ${Sc}\\% 								
							\\end{aligned}
						`)} />
			</section>
		{/if}
	</section>
</article>

<style lang="scss">
	section.fig form {
		input {
			width: 4.25rem;
			font-size: 0.9rem;
			padding-left: 0.1rem;
			padding-right: 0.1rem;
			cursor: pointer;
		}

		label {
			// font-size: 90%;
			position: absolute;
			padding: 0 0.25em;

			&.y {
				color: white;
				padding: 0.25em;
				// margin: 0.25em;
				top: 37%;
				left: 46%;
				background-color: var(--primaryColor);
			}

			&.zl {
				top: 64%;
				left: 30%;
				background-color: transparent;
				font-size: 90%;
			}
			&.zr {
				top: 64%;
				left: 63%;
				background-color: transparent;
				font-size: 90%;
			}
		}
		.lower-inputs {
			display: flex;
			justify-content: space-between;
			margin-top: -1em;

			label {
				position: relative;
				padding: 0 0.25em;
			}
		}
	}
</style>
