<script>
	import Card from "./Card.svelte";
	import { fade } from "svelte/transition";
	import { ki, kd, fluids } from "$lib/utilities";

	let sdigs = 3,
		wdigs = 6,
		validS = true,
		extraDig = true;

	$: sds = (num, digs = sdigs) => {
		let n = num.toString(),
			d = digs;
		if (extraDig) {
			while (n[0] === "0" || n[0] === "." || n[0] === "+" || n[0] === "-") {
				n = n.slice(1);
			}
		}
		if (n[0] == "1") {
			d++;
		}
		return parseFloat(num).toPrecision(d);
	};
	$: sdw = (num, digs = wdigs) => {
		num = num.toString();
		return parseFloat(num).toPrecision(digs);
	};
	// needs access to n, b, s so has to be in this file?
	$: getQfromY = (y) => {
		var A = b * y;
		let v = fluids.getV(n, fluids.getR(fluids.getArea(b, y), fluids.getWP(b, y)), s);
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

	// variables ending in s are string inputs, bound to numerical input fields
	let bs = 3,
		ys = 1.75,
		ss = 0.1,
		ns = 0.013,
		gs = 9.81;
	// inputs
	$: b = sds(bs);
	$: y = sds(ys);
	$: n = Number(sds(ns));
	$: s = Number(sds(ss));
	$: g = Number(sds(gs));
	// calculations for y specified
	$: A = sdw(fluids.getArea(b, y));
	$: WP = sdw(fluids.getWP(b, y));
	$: R = sdw(fluids.getR(A, WP));
	$: v = sdw(fluids.getV(n, R, s));
	$: Q = sdw(fluids.getQfromAandV(A, v));
	$: E = sdw(fluids.getE(y, v, g));
	$: T = sds(b);
	$: NF = sdw(fluids.getNF(v, A, T, g));
	$: yc = sdw(fluids.getYc(Q, g, b));
	$: WPc = sdw(fluids.getWP(b, yc));
	$: Ac = sdw(fluids.getArea(b, yc));
	$: Rc = sdw(fluids.getR(Ac, WPc));
	$: vc = sdw(fluids.getVfromQandA(Q, Ac));
	$: Emin = sdw(fluids.getE(yc, vc, g));
	$: Sc = sdw(fluids.getCriticalSlope(n, vc, Rc));
</script>

<article>
	<section class="fig">
		<div class="width75">
			<img src="/ocfc/rectangularChannelSectionQ.png" alt="rectangular channel section" />
			<img class="super" src="/ocfc/rectangularChannelSectionY.png" alt="rectangular channel section by depth" />
		</div>
		<form>
			<label class="b">
				{@html ki(`\\large b=`)}
				<input type="number" step="any" required bind:value={bs} />
				{@html ki(`\\textsf{m}`)}
			</label>

			<label class="y">
				{@html ki(`\\large y=`)}
				<input type="number" step="any" required bind:value={ys} />
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
					answer="Flow Area: {ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}"
					solution={kd(`
                            \\begin{aligned}
                                A &= by \\\\
                                &= ${b}\\, \\mathsf{m} \\times ${y}\\, \\mathsf{m} \\\\
                                &= ${A}\\, \\mathsf{m^2}
                            \\end{aligned}
                        `)} />

				<Card
					answer="Wetted Perimeter: {ki(`W\\!P = ${sds(WP)}\\, \\mathsf{m}`)}"
					solution={kd(`
                            \\begin{aligned}
                                WP &= b+2y \\\\
                                &= ${b}\\, \\mathsf{m} + 2\\times ${y}\\, \\mathsf{m} \\\\
                                &= ${WP}\\, \\mathsf{m}
                            \\end{aligned}
                        `)} />
				<Card
					answer="Hydraulic Radius: {ki(`R = ${sds(R)}\\, \\mathsf m`)}  "
					solution={kd(`
                            \\begin{aligned}
                                R &= A/W\\!P \\\\
                                &= ${A}\\, \\mathsf{m^2} / ${WP}\\, \\mathsf{m} \\\\
                                &= ${R} \\mathsf{m}
                            \\end{aligned}
                        `)} />
				<Card
					answer="Average Flow Velocity: {ki(`v = ${sds(v)}\\, \\mathsf{m/s}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               v &= \\frac 1n R^{2/3} S^{1/2} \\\\
							   &= \\frac{1}{${n}} \\left(${R}\\right)^{2/3} \\left(${s}\\right)^{1/2} \\\\
							   &= ${v} \\, \\mathsf{m/s}
                            \\end{aligned}
                        `)} />
				<Card
					answer="Flow Rate: {ki(`Q = ${sds(Q)}\\, \\mathsf{m^3/s}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               Q &= Av \\\\
							   &= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\
							   &= ${Q} \\, \\mathsf{m^3/s}
                            \\end{aligned}
                        `)} />
				<Card
					answer="Specific Energy: {ki(`E = ${sds(E)}\\, \\mathsf{m}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               E &= y+\\frac{v^2}{2g} \\\\
							   &= ${y}\\, \\mathsf{m}+\\frac{(${v} \\, \\mathsf{m/s)^2} }
							   		{2(${g}\\, \\mathsf{m/s^2}) } \\\\
							   &= ${E}\\,\\mathsf{m}
                            \\end{aligned}
                        `)} />
				<Card
					answer="Free Surface: {ki(`T = ${sds(T)}\\, \\mathsf{m}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               T &= b \\\\
							   &= ${sds(b)}\\, \\mathsf{m} \\\\
							   
                            \\end{aligned}
                        `)} />
				<Card
					answer="Froude Number: {ki(`N_F = ${sds(NF)}`)}  "
					solution={kd(`
                            \\begin{aligned}
                               N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
							   &=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sdw(A)}\\, \\mathsf{m^2}/${sds(
						T
					)}\\, \\mathsf{m})}} \\\\
							   &= ${sdw(NF)}
                            \\end{aligned}
                        `)} />
			</section>
			<section>
				<h1>Critical Flow</h1>

				<Card
					answer="For the {ki(`Q=${sdw(Q)} \\, \\mathsf{m^3\\!/s}`)} above, Critical Depth {ki(
						`yc=${sds(yc)} \\, \\mathsf{m}`
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
								\\Rightarrow y_c &= \\sqrt[3]{\\frac{(${Q}\\, \\mathsf{m^3\\!/s})^2}{(${sds(
						b
					)}\\, \\mathsf{m} )^2(${g}\\, \\mathsf{m/s^2})}}\\\\
								&= ${yc}\\, \\mathsf{m}

                            \\end{aligned}
                        `)} />
				<Card
					answer="Critical Velocity: {ki(` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`)}  "
					solution={kd(`
							\\begin{aligned}
								A_c &= by_c \\\\
								&= ${b}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac}\\, \\mathsf{m^2}\\\\\\\\
								v_c &= Q/A_c \\\\
								&= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\
								&= ${vc} \\,\\mathsf{m/s}
							\\end{aligned}	`)} />
				<Card
					answer="Minimum Specific Energy: {ki(`E_{min} = ${sds(Emin)}\\, \\mathsf{m}`)}"
					solution={kd(`
							\\begin{aligned}
								E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
								&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\
								&= ${Emin} \\,\\mathsf{m}
							\\end{aligned}
						`)} />
				<Card
					answer="Slope for Critical Flow: {ki(`S_c = ${sds(Sc)}\\%`)}"
					solution={kd(`
							\\begin{aligned}
								A_c &= by_c \\\\
								&= ${b}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac} \\,\\mathsf{m^2} \\\\ \\\\

								W\\!P_c &= b + 2y_c \\\\
								&= ${b}\\, \\mathsf{m}+2(${yc}\\, \\mathsf{m}) \\\\
								&= ${WPc}\\, \\mathsf{m}\\\\\\\\

								R_c &= A_c/P_c \\\\
								&= \\frac{${Ac}\\, \\mathsf{m^2}}{${WPc}\\, \\mathsf{m}} \\\\
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
				top: 37%;
				left: 47.5%;
				background-color: #088;
			}

			&.b {
				top: 70%;
				left: 40%;
				background-color: #ccc;
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
