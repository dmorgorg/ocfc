<script>
	import Card from "./Card.svelte";
	import { fade } from "svelte/transition";
	import { ki, kd, fluids, utils } from "$lib/utilities";

	let sdigs = 3,
		wdigs = 6,
		validS = true,
		extraDig = true,
		extraWorkingDig = false;

	
	// needs access to n, b, s so has to be in this file?
	$: getQfromY = (y) => {
		var A = b * y;
		let v = fluids.getV(n, fluids.getR(fluids.getArea(b, y), fluids.getP(b, y)), s);
		return A * v;
	};
	$: getYfromQ = (low = 0, high = 100) => {
		let delta = 1 / 10 ** (wdigs + 1),
			mid = (low + high) / 2;
		// console.log(delta+', '+low+', '+high);
		if (Math.abs(low - high) < delta) {
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
	let bs = 3,
		QQs = 3.25,
		ss = 0.1,
		ns = 0.013,
		gs = 9.81;
	// inputs
	$: b = Number(bs);
	$: QQ = Number(QQs);
	$: n = Number(ns);
	$: s = Number(ss);
	$: g = Number(gs);
	// calculations for Q specified
	$: yQ = sd(getYfromQ(), wdigs, extraWorkingDig);
	$: AQ = sd(fluids.getArea(b, yQ), wdigs, extraWorkingDig);
	$: vQ = sd(fluids.getVfromQandA(QQ, AQ), wdigs, extraWorkingDig);
	$: EQ = sd(fluids.getE(yQ, vQ, g), wdigs, extraWorkingDig);
	$: T = sd(b, sdigs, extraDig);
	$: NFQ = sd(fluids.getNF(vQ, AQ, T, g), wdigs, extraWorkingDig);
	$: ycQ = sd(fluids.getYc(QQ, g, b), wdigs, extraWorkingDig);
	$: PcQ = sd(fluids.getP(b, ycQ), wdigs, extraWorkingDig);
	$: AcQ = sd(fluids.getArea(b, ycQ), wdigs, extraWorkingDig);
	$: RcQ = sd(fluids.getR(AcQ, PcQ), wdigs, extraWorkingDig);
	$: vcQ = sd(fluids.getVfromQandA(QQ, AcQ), wdigs, extraWorkingDig);
	$: EminQ = sd(fluids.getE(ycQ, vcQ, g), wdigs, extraWorkingDig);
	$: ScQ = sd(fluids.getCriticalSlope(n, vcQ, RcQ), wdigs, extraWorkingDig);
</script>

<article>
	<section class="fig">
		<div class="width75">
			<img src="/ocfc/rectangularChannelSectionQ.png" alt="rectangular channel section" />
		</div>
		<form>
			<label class="b">
				{@html ki(`\\large b=`)}
				<input type="number" step="any" bind:value={bs} />
				{@html ki(`\\textsf{m}`)}
			</label>

			<label class="Q">
				{@html ki(`\\large Q=`)}
				<input type="number" step="any" bind:value={QQs} />
				{@html ki(`\\mathsf{m^3\\!/s}`)}
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
					answer="Depth of flow: {ki(`${sd(yQ, sdigs, extraDig)}\\, \\mathsf{m}`)}"
					solution="{kd(`
						\\begin{aligned}
							Q &= \\frac 1n AR^{2/3}S^{1/2} \\\\
							&= \\frac 1n \\cdot by\\cdot\\left(\\frac{by}{b+2y}\\right)^{2/3}\\!\\!\\cdot S^{ 1/2 } \\\\
							\\Rightarrow ${QQ}\\, \\mathsf{m^3\\!/s} &= \\frac 1{${n}} \\cdot (${b}\\, \\mathsf{m})y\\cdot\\left(\\frac{${b}y}{${b}+2y}\\right)^{2/3}\\!\\!\\cdot\\! (${
						s / 100
					})^{ 1/2 } 
						\\end{aligned}`)}
						<div style='width: 85%; margin-left: 7.5%; '>The expression above cannot be solved directly (analytically) for {ki(
						`y`
					)}. It may be solved using trial-and-error methods but it is generally more convenient to solve it, without further simplification, using a numerical solver on a scientific calculator or in a spreadsheet app. (This calculator uses an automated type of trial-and-error called a binary search, probably similar to how your scientific calculator does it.)</div>
						{kd(`
						y=${yQ}\\, \\mathsf{m}
						`)}" />
				<Card
					answer="Flow Area: {ki(`${sd(AQ, sdigs, extraDig)}\\, \\mathsf{m^2}`)} "
					solution={kd(`
						\\begin{aligned}
							A &= by \\\\
							&= ${b}\\, \\mathsf{m}\\times ${yQ}\\, \\mathsf{m} \\\\							
							&= ${AQ} \\, \\mathsf{m^2}
						\\end{aligned}
					`)} />
				<Card
					answer="Average Flow Velocity: {ki(`${sd(vQ, sdigs, extraDig)}\\, \\mathsf{m/s} `)}"
					solution={kd(`
						\\begin{aligned} 
							v &= Q/A \\\\
						 	&= \\frac{${QQ}\\, \\mathsf{m^3\\!/s}}{${AQ}\\, \\mathsf{m^2}} \\\\					
							&= ${vQ} \\, \\mathsf{m/s}
						\\end{aligned}`)} />
				<Card
					answer="Specific Energy: {ki(`E=${sd(EQ, sdigs, extraDig)}\\, \\mathsf{m} `)}"
					solution={kd(`
						\\begin{aligned} 
							E &= y+\\frac{v^2}{g} \\\\
						 	&= ${yQ}\\, \\mathsf{m}+\\frac{(${vQ}\\, \\mathsf{m/s})^2}{${g}\\, \\mathsf{m/s^2}} \\\\					
							&= ${EQ} \\, \\mathsf{m}
						\\end{aligned}`)} />
				<Card
					answer="Free Surface: {ki(`T = ${sd(T, sdigs, extraDig)}\\, \\mathsf{m}`)}  "
					solution={kd(`
						\\begin{aligned}
							T &= b \\\\
							&= ${sd(b, sdigs, extraDig)}\\, \\mathsf{m} \\\\							
						\\end{aligned}
				`)} />
				<Card
					answer="Froude Number: {ki(`N_F = ${sd(NFQ, sdigs, extraDig)}`)}  "
					solution={kd(`
						\\begin{aligned}
							N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
							&=  \\frac{${vQ}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sd(AQ, wdigs, extraWorkingDig)}\\, \\mathsf{m^2}/${sd(
						T, sdigs, extraDig)}\\, \\mathsf{m})}} \\\\
							&= ${sd(NFQ, wdigs, extraWorkingDig)}
						\\end{aligned}
				`)} />
				<section>
					<h1>Critical Flow</h1>

					<Card
						answer="For the {ki(`Q=${sd(QQ, wdigs, extraWorkingDig)} \\, \\mathsf{m^3\\!/s}`)} above, Critical Depth {ki(
							`yc=${sd(ycQ, sdigs, extraDig)} \\, \\mathsf{m}`
						)}"
						solution={kd(`
                            \\begin{aligned}
                               	N_F &= 1 \\\\
								\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
								\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
								\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\
								&= \\frac{\\left(by_c\\right)^3}{b}	\\\\
								&= b^2y_c^3 \\\\
								\\Rightarrow y_c^3 &= \\frac{Q^2}{b^2g} \\\\
								\\Rightarrow y_c &= \\sqrt[3]{\\frac{Q^2}{b^2g}} \\\\
								\\Rightarrow y_c &= \\sqrt[3]{\\frac{(${QQ}\\, \\mathsf{m^3\\!/s})^2}{(${sd(
							b, sdigs, extraDig)}\\, \\mathsf{m} )^2(${g}\\, \\mathsf{m/s^2})}}\\\\
								&= ${ycQ}\\, \\mathsf{m}

                            \\end{aligned}
                        `)} />
					<Card
						answer="Critical Velocity: {ki(` v_c = ${sd(vcQ, sdigs, extraDig)}  \\,\\mathsf{m/s}`)}  "
						solution={kd(`
							\\begin{aligned}
								A_c &= by_c \\\\
								&= ${b}\\, \\mathsf{m}\\times ${ycQ}\\, \\mathsf{m} \\\\
								&= ${AcQ}\\, \\mathsf{m^2}\\\\\\\\
								v_c &= Q/A_c \\\\
								&= \\frac{${QQ}\\, \\mathsf{m^3\\!/s}}{${AcQ}\\, \\mathsf{m^2}} \\\\ \\\\
								v_c &= ${vcQ} \\,\\mathsf{m/s}
							\\end{aligned}	`)} />
					<Card
						answer="Minimum Specific Energy: {ki(`E_{min} = ${sd(EminQ, sdigs, extraDig)}\\, \\mathsf{m}`)}"
						solution={kd(`
							\\begin{aligned}
								E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
								&= ${ycQ}\\, \\mathsf{m}+\\frac{ (${vcQ}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\ \\\\
								E &= ${EminQ} \\,\\mathsf{m}
							\\end{aligned}
						`)} />
					<Card
						answer="Slope for Critical Flow: {ki(`S_c = ${sd(ScQ, sdigs, extraDig)}\\%`)}"
						solution={kd(`
							\\begin{aligned}
								A_c &= by_c \\\\
								&= ${b}\\, \\mathsf{m}\\times ${ycQ}\\, \\mathsf{m} \\\\
								&= ${AcQ} \\,\\mathsf{m^2} \\\\ \\\\

								P_c &= b + 2y_c \\\\
								&= ${b}\\, \\mathsf{m}+2(${ycQ}\\, \\mathsf{m}) \\\\
								&= ${PcQ}\\, \\mathsf{m} \\\\ \\\\

								R_c &= A_c/P_c \\\\
								&= \\frac{${AcQ}\\, \\mathsf{m^2}}{${PcQ}\\, \\mathsf{m}} \\\\
								&= ${RcQ}\\,\\mathsf{m}\\\\\\\\

								\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
								&= \\left(\\frac{${n}\\times ${vcQ}\\, \\mathsf{m/s} }{ (${RcQ}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
								&= ${ScQ / 100} \\\\
								&= ${ScQ}\\% 								
							\\end{aligned}
						`)} />
				</section>
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

			&.b {
				top: 70%;
				left: 40%;
				background-color: #ccc;
			}

			&.Q {
				top: 37%;
				left: 37%;
				background-color: #088;
				padding: 0;
				color: white;
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
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
