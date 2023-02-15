<script>
	import Card from "./Card.svelte";
	// import { fade } from "svelte/transition";
	import { ki, kd, fluids, utils, tri, circ } from "$lib/utilities";

	let sdigs = 3,
		wdigs = 6,
		validS = true,
		extraDig = true,
		extraWorkingDig = true;

	// needs access to n, b, s so has to be in this file?
	$: getQfromY = (y) => {
		var A = b * y;
		let v = fluids.getV(n, fluids.getR(fluids.getArea(b, y), fluids.getP(b, y)), s);
		return A * v;
	};
	$: getYfromQ = (low = 0, high = 100) => {
		let delta = 1 / 10 ** (wdigs + 1),
			mid = (low + high) / 2;
		if (Math.aDs(low - high) < delta) {
			return (low + high) * 0.5;
		}
		// search
		if (getQfromY(mid) < QQ) {
			return getYfromQ(mid, high);
		} else {
			return getYfromQ(low, mid);
		}
	};

	let sd = utils.sd;

	// variables ending in s are string inputs, bound to numerical input fields
	let Ds = 1.5,
		ys = .5,
		ss = 0.2,
		ns = 0.013,
		gs = 9.81;
	// inputs
	$: D = sd(Ds, sdigs, extraDig);
	$: y = sd(ys, sdigs, extraDig);
	$: n = Number(sd(ns, sdigs, extraDig));
	$: s = Number(sd(ss, sdigs, extraDig));
	$: g = Number(sd(gs, sdigs, extraDig));
	// calculations for y specified
	y = y < 0 ? 0 : y;
	y = y > D ? D : y;
	$: r = sd(D/2, sdigs, extraDig);
	$: alpha = sd(circ.getAlphaDegrees(y, r), wdigs, extraWorkingDig);
	$: alphaRad = sd(circ.getAlphaRadians(y, r), wdigs, extraWorkingDig);
	$: theta = sd(circ.getThetaDegrees(y, r), wdigs, extraWorkingDig);
	$: thetaRad = sd(circ.getThetaRadians(y, r), wdigs, extraWorkingDig);
	$: A = sd(circ.getArea(thetaRad, D), wdigs, extraWorkingDig);
	$: P = sd(circ.getP(thetaRad, D), wdigs, extraWorkingDig);
	$: R = sd(fluids.getR(A, P), wdigs, extraWorkingDig);
	$: v = sd(fluids.getV(n, R, s), wdigs, extraWorkingDig);
	$: Q = sd(fluids.getQfromAandV(A, v), wdigs, extraWorkingDig);
	$: E = sd(fluids.getE(y, v, g), wdigs, extraWorkingDig);
	$: T = sd(circ.getT(alpha, D), wdigs, extraWorkingDig);
	$: NF = sd(fluids.getNF(v, A, T, g), wdigs, extraWorkingDig);
	// $: yc = sd(tri.getYc(Q, g, b), wdigs, extraWorkingDig);
	// $: Pc = sd(tri.getP(b, yc), wdigs, extraWorkingDig);
	// $: Ac = sd(fluids.getArea(b, yc), wdigs, extraWorkingDig);
	// $: Rc = sd(fluids.getR(Ac, Pc), wdigs, extraWorkingDig);
	// $: vc = sd(fluids.getVfromQandA(Q, Ac), wdigs, extraWorkingDig);
	// $: Emin = sd(fluids.getE(yc, vc, g), wdigs, extraWorkingDig);
	// $: Sc = sd(fluids.getCriticalSlope(n, vc, Rc), wdigs, extraWorkingDig);
</script>



<article>
	<section class="fig">
		<div>
			<div class:hide={!(y < D / 2)}>
				<img src="/ocfc/circularChannelSectionUnderHalf.png" alt="circular channel section by depth under half full" />
			</div>
			<div class:hide={!(y == D / 2)}>
				<img src="/ocfc/circularChannelSectionHalf.png" alt="circular channel section by depth half full" />
			</div>
			<div class:hide={!(y > D / 2 && y<D)}>
				<img src="/ocfc/circularChannelSectionOverHalf.png" alt="circular channel section by depth over half full" />
			</div>
			<div class:hide={!(y == D)}>
				<img src="/ocfc/circularChannelSectionFull.png" alt="circular channel section by depth full" />
			</div>
		</div>
		<form>
			<label class="diam">
				{@html ki(`\\large D=`)}
				<input type="number" step="any" bind:value={Ds} />
				{@html ki(`\\textsf{m}`)}
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
				{#if y < D/2}
					<Card
						answer= {ki(`\\alpha = ${sd(alpha, wdigs, extraWorkingDig)}^\\circ`)}
						solution={kd(`
                            \\begin{aligned}
                                \\alpha &= \\cos^{-1} \\left(\\frac{OA}{OB} \\right)\\\\
								&= \\cos^{-1} \\left(\\frac{D/2-y}{D/2} \\right)\\\\
								&= \\cos^{-1} \\left(\\frac{${r}\\, \\mathsf{m}-${y}\\, \\mathsf{m}}{${r}\\, \\mathsf{m}} \\right)\\\\\\\\
								\\alpha &= ${sd(alpha, wdigs, extraWorkingDig)}^\\circ
                            \\end{aligned}
                        `)}
					/>
					<Card
						answer= {ki(`\\theta = ${sd(theta, wdigs, extraWorkingDig)}^\\circ\\quad (=${thetaRad}\\;\\mathsf{rad})`)}
						solution={kd(`
                            \\begin{aligned}
                                \\theta &= 2 \\alpha \\\\
                                &= 2 \\left(${alpha}^\\circ \\right)\\\\
                                &= ${2*alpha}^\\circ \\\\\\\\
								
								\\theta_\\mathsf{rad} &= \\theta\\cdot\\frac{\\pi}{180^\\circ} \\\\
								&= ${theta}\\cdot\\frac{\\pi}{180^\\circ} \\\\\\\\
								\\theta_\\mathsf{rad} &= ${sd(thetaRad, wdigs, extraWorkingDig)}
                            \\end{aligned}
                        `)}
					/>
					<Card
					answer="Flow Area: {ki(`A = ${sd(A, sdigs, extraDig)}\\, \\mathsf{m^2}`)}"
					solution="{kd(`
                            \\begin{aligned}
                                A &= \\frac{(\\theta-\\sin\\theta)D^2}{8}
							\\end{aligned}
							`)}
							<div style='width: 85%; margin-left: 7.5%; '>This area formula requires {ki(`\\theta`)} to be in radians. Rather than switching my calculator to radian mode (and possibly forgetting to change it back...), I choose to use {ki(`\\sin(${theta})`)} with {ki(`\\theta`)} in degrees and my calculator in degree mode, noting that {ki(`\\sin\\theta_{\\mathsf{rad}}`)} in radian mode has the same value as {ki(`\\sin\\theta`)} in degree mode.</div>
							{kd(`
							\\begin{aligned}                               
                                A &= \\frac{(${thetaRad}-\\sin ${theta}^\\circ)\\cdot (${D}\\, \\mathsf{m})^2}{8} \\\\\\\\
                                A &= ${A}\\, \\mathsf{m^2}
                            \\end{aligned}
                        `)}" />
						<Card
							answer="Wetted Perimeter: {ki(`P = ${sd(P, sdigs, extraDig)}\\, \\mathsf m`)}  "
							solution={kd(`
								\\begin{aligned}
									P &= \\theta_{\\mathsf{rad}}\\cdot\\frac{D}{2}\\\\
									&= ${thetaRad}\\cdot\\frac{${D}\\, \\mathsf{m}}{2} \\\\\\\\
									P &= ${P}\\, \\mathsf{m}
								\\end{aligned}
                        `)} />
						<Card
							answer="Hydraulic Radius: {ki(`R = ${sd(R, sdigs, extraDig)}\\, \\mathsf m`)}  "
							solution="{kd(`
								\\begin{aligned}
									R &= A/P \\\\
									&= \\frac{${A}\\, \\mathsf{m^2}}{ ${P}\\, \\mathsf{m}} \\\\\\\\
									R &= ${R} \\mathsf{m}
								\\end{aligned}
                        `)} 
						<div style='width: 85%; margin-left: 7.5%; '>Alternatively, there is a well-known formula that calculates the hydraulic radius directly without first calculating the wetted perimeter:</div>
						{kd(`
								\\begin{aligned}
									R &= \\left[\\frac{\\theta_{\\mathsf{rad}}-\\sin\\theta}{\\theta_\\mathsf{rad}} \\right] \\cdot \\frac D4 \\\\
									&= \\left[\\frac{${thetaRad}-\\sin ${theta}^\\circ}{${thetaRad}} \\right] \\cdot \\frac{${D}\\, \\mathsf{m}}{4} \\\\\\\\
									R &= ${R} \\mathsf{m}
								\\end{aligned}
                        `)}" />
						<Card
							answer="Average Flow Velocity: {ki(`v = ${sd(v, sdigs, extraDig)}\\, \\mathsf{m/s}`)}  "
							solution={kd(`
								\\begin{aligned}
									v &= \\frac 1n R^{2/3} S^{1/2} \\\\
									&= \\frac{1}{${n}} \\left(${R}\\right)^{2/3} \\left(${s/100}\\right)^{1/2} \\\\\\\\
									v &= ${v} \\, \\mathsf{m/s}
								\\end{aligned}
                        `)} />
						<Card
							answer="Flow Rate: {ki(`Q = ${sd(Q, sdigs, extraDig)}\\, \\mathsf{m^3/s}`)}  "
							solution={kd(`
								\\begin{aligned}
									Q &= Av \\\\
									&= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\\\\\
									Q &= ${Q} \\, \\mathsf{m^3/s}
								\\end{aligned}
                        `)} />
						<Card
							answer="Specific Energy: {ki(`E = ${sd(E, sdigs, extraDig)}\\, \\mathsf{m}`)}  "
							solution={kd(`
								\\begin{aligned}
									E &= y+\\frac{v^2}{2g} \\\\
									&= ${y}\\, \\mathsf{m}+\\frac{(${v} \\, \\mathsf{m/s)^2} }
											{2(${g}\\, \\mathsf{m/s^2}) } \\\\\\\\
									E &= ${E}\\,\\mathsf{m}
								\\end{aligned}
                        `)} />
						<Card
							answer="Free Surface: {ki(`T = ${sd(T, sdigs, extraDig)}\\, \\mathsf{m}`)}  "
							solution={kd(`
								\\begin{aligned}
									T &= 2AB \\\\
									&= D\\sin \\alpha \\\\
									&= ${D}\\, \\mathsf{m}\\cdot\\sin ${alpha}^\\circ \\\\\\\\
									T &= ${T}\\, \\mathsf{m}							
								\\end{aligned}
                        `)} />
						<Card
							answer="Froude Number: {ki(`N_F = ${sd(NF, sdigs, extraDig)}`)}  "
							solution={kd(`
                            	\\begin{aligned}
									N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
									&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${A}\\, \\mathsf{m^2}/${T}\\, \\mathsf{m})}} \\\\\\\\
									N_F &= ${NF}
								\\end{aligned}
                        `)} />
					
				{/if}
				<!-- <Card
					answer="Flow Area: {ki(`A = ${sd(A, sdigs, extraDig)}\\, \\mathsf{m^2}`)}"
					solution={kd(`
                            \\begin{aligned}
                                A &= by \\\\
                                &= ${b}\\, \\mathsf{m} \\times ${y}\\, \\mathsf{m} \\\\
                                &= ${A}\\, \\mathsf{m^2}
                            \\end{aligned}
                        `)} /> -->

				<!-- <Card
					answer="Wetted Perimeter: {ki(`P = ${sd(P, sdigs, extraDig)}\\, \\mathsf{m}`)}"
					solution={kd(`
                            \\begin{aligned}
                                P &= b+2y \\\\
                                &= ${b}\\, \\mathsf{m} + 2\\times ${y}\\, \\mathsf{m} \\\\
                                &= ${P}\\, \\mathsf{m}
                            \\end{aligned}
                        `)} /> -->
				<!-- <Card
					answer="Hydraulic Radius: {ki(`R = ${sd(R, sdigs, extraDig)}\\, \\mathsf m`)}  "
					solution={kd(`
                            \\begin{aligned}
                                R &= A/P \\\\
                                &= ${A}\\, \\mathsf{m^2} / ${P}\\, \\mathsf{m} \\\\
                                &= ${R} \\mathsf{m}
                            \\end{aligned}
                        `)} /> -->
				<!-- <Card
					answer="Average Flow Velocity: {ki(`v = ${sd(v, sdigs, extraDig)}\\, \\mathsf{m/s}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               v &= \\frac 1n R^{2/3} S^{1/2} \\\\
							   &= \\frac{1}{${n}} \\left(${R}\\right)^{2/3} \\left(${s/100}\\right)^{1/2} \\\\
							   &= ${v} \\, \\mathsf{m/s}
                            \\end{aligned}
                        `)} /> -->
				<!-- <Card
					answer="Flow Rate: {ki(`Q = ${sd(Q, sdigs, extraDig)}\\, \\mathsf{m^3/s}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               Q &= Av \\\\
							   &= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\
							   &= ${Q} \\, \\mathsf{m^3/s}
                            \\end{aligned}
                        `)} /> -->
				<!-- <Card
					answer="Specific Energy: {ki(`E = ${sd(E, sdigs, extraDig)}\\, \\mathsf{m}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               E &= y+\\frac{v^2}{2g} \\\\
							   &= ${y}\\, \\mathsf{m}+\\frac{(${v} \\, \\mathsf{m/s)^2} }
							   		{2(${g}\\, \\mathsf{m/s^2}) } \\\\
							   &= ${E}\\,\\mathsf{m}
                            \\end{aligned}
                        `)} /> -->
				<!-- <Card
					answer="Free Surface: {ki(`T = ${sd(T, sdigs, extraDig)}\\, \\mathsf{m}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               T &= b \\\\
							   &= ${sd(b, sdigs, extraDig)}\\, \\mathsf{m} \\\\
							   
                            \\end{aligned}
                        `)} /> -->
				<!-- <Card
					answer="Froude Number: {ki(`N_F = ${sd(NF, sdigs, extraDig)}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
							   &=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sd(A, wdigs, extraWorkingDig)}\\, \\mathsf{m^2}/${sd(
						T
					)}\\, \\mathsf{m})}} \\\\
							   &= ${sd(NF, wdigs, extraWorkingDig)}
                            \\end{aligned}
                        `)} /> -->
			</section>
			<section>
				<h1>Critical Flow</h1>

				<Card
					answer="For the {ki(`Q=${sd(Q, wdigs, extraWorkingDig)} \\, \\mathsf{m^3\\!/s}`)} above, Critical Depth {ki(
						`yc=${sd(y)} \\, \\mathsf{m}`
					)}"
					solution={kd(`
                            \\begin{aligned}
                               	N_F &= 1 \\\\
								\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
								\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
								\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\
								&= \\frac{\\left((\\theta-\\sin \\theta)D^2/8\\right)^3}{D\\sin\\alpha}



								

                            \\end{aligned}
                        `)} />
				<!-- <Card
					answer="Critical Velocity: {ki(` v_c = ${sd(vc, sdigs, extraDig)}  \\,\\mathsf{m/s}`)}  "
					solution={kd(`
							\\begin{aligned}
								A_c &= by_c \\\\
								&= ${b}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac}\\, \\mathsf{m^2}\\\\\\\\
								v_c &= Q/A_c \\\\
								&= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\
								&= ${vc} \\,\\mathsf{m/s}
							\\end{aligned}	`)} /> -->
				<!-- <Card
					answer="Minimum Specific Energy: {ki(`E_{min} = ${sd(Emin, sdigs, extraDig)}\\, \\mathsf{m}`)}"
					solution={kd(`
							\\begin{aligned}
								E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
								&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\
								&= ${Emin} \\,\\mathsf{m}
							\\end{aligned}
						`)} /> -->
				<!-- <Card
					answer="Slope for Critical Flow: {ki(`S_c = ${sd(Sc, sdigs, extraDig)}\\%`)}"
					solution={kd(`
							\\begin{aligned}
								A_c &= by_c \\\\
								&= ${b}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac} \\,\\mathsf{m^2} \\\\ \\\\

								P_c &= b + 2y_c \\\\
								&= ${b}\\, \\mathsf{m}+2(${yc}\\, \\mathsf{m}) \\\\
								&= ${Pc}\\, \\mathsf{m}\\\\\\\\

								R_c &= A_c/P_c \\\\
								&= \\frac{${Ac}\\, \\mathsf{m^2}}{${Pc}\\, \\mathsf{m}} \\\\
								&= ${Rc}\\,\\mathsf{m}\\\\\\\\

								\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
								&= \\left(\\frac{${n}\\times ${vc}\\, \\mathsf{m/s} }{ (${Rc}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
								&= ${Sc / 100} \\\\
								&= ${Sc}\\% 								
							\\end{aligned}
						`)} /> -->
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
				
				padding: 0.25em;
				top: 65%;
				left: 3%;
				background-color: white;
			}

			&.diam {
				padding: 0.25em;
				top: 43%;
				left: 75%;
				background-color: white;
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
