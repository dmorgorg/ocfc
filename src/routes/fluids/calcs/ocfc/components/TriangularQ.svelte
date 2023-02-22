<script>
	import Card from "./Card.svelte";
	import { fade } from "svelte/transition";
	import { ki, kd, fluids, tri, utils } from "$lib/utilities";

	let sdigs = 3,
		wdigs = 6,
		validS = true,
		extraDig = true,
		extraWorkingDig = false;

	
	$: getYfromQ = (Q, zl, zr, s, n) => {
		let num = Q*n*2**(5/3)*((1+zl*zl)**0.5+(1+zr*zr)**0.5)**(2/3);
		let den = (s/100)**0.5*(Number(zl) + Number(zr))**(5/3);
		return (num/den)**(3/8);
	};
	$: getYCfromQ = (Q, zl, zr, g) => {
		return (8*Q*Q/g/(Number(zl)+Number(zr))**2)**0.2;
	}

	let sd = utils.sd;
	const sdw = (num) => {
		return utils.sd(num, wdigs, extraWorkingDig);
	};

	const sds = (num) => {
		return utils.sd(num, sdigs, extraDig);
	};

	// variables ending in s are string inputs, bound to numerical input fields
			let Qs = 3.25,
		zls = 1,
		zrs = 1,
		ss = 0.1,
		ns = 0.013,
		gs = 9.81;
	// inputs
	$: Q = sds(Qs);
	$: zl = sds(zls);
	$: zr = sds(zrs);
	$: n = Number(sds(ns));
	$: s = Number(sds(ss));
	$: g = Number(sds(gs));
	// calculations for Q specified
	$: y = sdw(getYfromQ(Q, zl, zr, s, n));
	$: A = sdw(tri.getArea(y, zl, zr));
	$: v = sdw(fluids.getVfromQandA(Q, A));
	$: E = sdw(fluids.getE(y, v, g));
	$: T = sds(tri.getT(y, zl, zr));
	$: NF = sdw(fluids.getNF(v, A, T, g));
	$: yc = sdw(getYCfromQ(Q, zl, zr, g));
	$: Ac = sdw(tri.getArea(yc, zl, zr));
	$: vc = sdw(fluids.getVfromQandA(Q, Ac));
	$: Emin = sdw(fluids.getE(yc, vc, g));
	$: Pc = sdw(tri.getP(yc, zl, zr));	
	$: Rc = sdw(fluids.getR(Ac, Pc));	
	$: Sc = sdw(fluids.getCriticalSlope(n, vc, Rc));
</script>



<article>
	<section class="fig">
		<div class="width85">
			<img src="/ocfc/triangularChannelSectionQ.png" alt="triangular channel section" />
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

			<label class="Q">
				{@html ki(`\\large Q=`)}
				<input type="number" step="any" bind:value={Qs} />
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
					answer="Depth of flow: {ki(`y=${sds(y)}\\, \\mathsf{m}`)}"
					solution="{kd(`
						\\begin{aligned}
							Q &= \\frac 1n AR^{2/3}S^{1/2} \\\\
							&= \\frac 1n A(A/P)^{ 2/3 }S^{ 1/2 }  \\\\
							&= \\frac 1n \\cdot \\frac{A^{5/3}}{P^{2/3}}\\cdot S^{ 1/2 } \\\\
							&= \\frac 1n \\cdot \\frac{\\left(\\left( z_L+z_R \\right)\\cdot y^2/2 \\right) ^{5/3}}{\\left(\\left(\\sqrt { 1+z_L^2 } + \\sqrt { 1+z_R^2 }\\right)\\cdot y\\right)^{2/3}}\\cdot S^{ 1/2 } \\\\
							&= \\frac{S^{1/2}}{n} \\cdot \\frac{\\left(z_L+z_R \\right)^{5/3}\\cdot y^{10/3}}{2^{5/3}\\left(\\sqrt { 1+z_L^2 } + \\sqrt { 1+z_R^2 }\\right)^{2/3}\\cdot y^{2/3}} \\\\
							\\Rightarrow y^{8/3} &= \\frac{Qn}{S^{1/2}} \\cdot \\frac{2^{5/3}\\left(\\sqrt { 1+z_L^2 } + \\sqrt { 1+z_R^2 }\\right)^{2/3}}{\\left(z_L+z_R \\right)^{5/3}} \\\\
							\\Rightarrow y &= \\left[\\frac{Qn}{S^{1/2}} \\cdot \\frac{2^{5/3}\\left(\\sqrt { 1+z_L^2 } + \\sqrt { 1+z_R^2 }\\right)^{2/3}}{\\left(z_L+z_R \\right)^{5/3}}\\right]^{3/8} \\\\
							\\Rightarrow y &= \\left[\\frac{${Q}\\times${n}}{${s/100}^{1/2}} \\cdot \\frac{2^{5/3}\\left(\\sqrt { 1+(${zl})^2 } + \\sqrt { 1+(${zr})^2 }\\right)^{2/3}}{\\left(${zl}+${zr} \\right)^{5/3}}\\right]^{3/8} \\\\
							

						\\end{aligned}`)}
						<div style='width: 85%; margin-left: 7.5%; '>A triangular channel is the only cross-section that can be solved directly (if laboriously) for depth from the volume flow rate.</div>
						{kd(`y=${yc}\\, \\mathsf{m}
						`)}" />
				<Card
					answer="Flow Area: {ki(`${sds(A)}\\, \\mathsf{m^2}`)} "
					solution={kd(`
						\\begin{aligned}
							A &= \\left( z_L+z_R \\right)\\cdot y^2/2 \\\\						
							&= \\left(${zl}+${zr} \\right)\\cdot (${y}\\, \\mathsf{m})^2/2 \\\\\\\\						
							A &= ${A} \\, \\mathsf{m^2}
						\\end{aligned}
					`)} />
				<Card
					answer="Average Flow Velocity: {ki(`${sds(v)}\\, \\mathsf{m/s} `)}"
					solution={kd(`
						\\begin{aligned} 
							v &= Q/A \\\\
						 	&= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${A}\\, \\mathsf{m^2}} \\\\\\\\					
							v &= ${v} \\, \\mathsf{m/s}
						\\end{aligned}`)} />
				<Card
					answer="Specific Energy: {ki(`E=${sds(E)}\\, \\mathsf{m} `)}"
					solution={kd(`
						\\begin{aligned} 
							E &= y+\\frac{v^2}{g} \\\\
						 	&= ${y}\\, \\mathsf{m}+\\frac{(${v}\\, \\mathsf{m/s})^2}{${g}\\, \\mathsf{m/s^2}} \\\\\\\\					
							E &= ${E} \\, \\mathsf{m}
						\\end{aligned}`)} />
				<Card
					answer="Free Surface: {ki(`T = ${sds(T)}\\, \\mathsf{m}`)}  "
					solution={kd(`
						\\begin{aligned}
							T &= \\left(z_L+z_R\\right)y \\\\
							 &= \\left(${zl}+${zr}\\right)(${y}\\, \\mathsf{m})\\\\\\\\
							T &= ${sdw(T)}\\, \\mathsf{m} \\\\							
						\\end{aligned}
				`)} />
				<Card
					answer="Froude Number: {ki(`N_F = ${sds(NF)}`)}  "
					solution={kd(`
						\\begin{aligned}
							N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
							&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sdw(A)}\\, \\mathsf{m^2}/${sds(T)}\\, \\mathsf{m})}} \\\\\\\\
						N_F	&= ${sdw(NF)}
						\\end{aligned}
				`)} />
				<section>
					<h1>Critical Flow</h1>

					<Card
						answer="For the {ki(`Q=${sds(Q)} \\, \\mathsf{m^3\\!/s}`)} above, Critical Depth {ki(
							`y_c=${sds(yc)} \\, \\mathsf{m}`
						)}"
						solution={kd(`
                            \\begin{aligned}
                               	N_F &= 1 \\\\
								\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
								\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
								\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\

								&= \\frac{\\left(\\left( z_L+z_R \\right)\\cdot y_c^2/2\\right) ^3}{(z_L+z_R)y_c} \\\\
							 	&= \\frac{\\left( z_L+z_R \\right) ^2}{2^3}\\cdot y^5 \\\\
								y^5 &= \\frac{8Q^2}{g(z_L+z_R)^2}	\\\\
								y &= \\left[\\frac{8Q^2}{g(z_L+z_R)^2}\\right]^{0.2}	\\\\
								&= \\left[\\frac{8(${Q}\\, \\mathsf{m^3\\!/s})^2}{${g}\\, \\mathsf{m/s^2}(${zl}+${zr})^2}\\right]^{0.2}	\\\\\\\\
								y_c &= ${yc}\\, \\mathsf{m}
                            \\end{aligned}
                        `)} />
					<Card
						answer="Critical Velocity: {ki(` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`)}  "
						solution={kd(`
							\\begin{aligned}
								A_c &= \\left( z_L+z_R \\right)\\cdot y_c^2/2 \\\\						
								&= \\left(${zl}+${zr} \\right)\\cdot (${yc}\\, \\mathsf{m})^2/2 \\\\						
								A_c &= ${Ac} \\, \\mathsf{m^2} \\\\\\\\
								v_c &= Q/A_c \\\\
								&= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\\\\\
								v_c &= ${vc} \\,\\mathsf{m/s}
							\\end{aligned}	
						ss`)} />
					<Card
						answer="Minimum Specific Energy: {ki(`E_{min} = ${sds(Emin)}\\, \\mathsf{m}`)}"
						solution={kd(`
							\\begin{aligned}
								E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
								&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\\\\\
								E_{min} &= ${Emin} \\,\\mathsf{m}
							\\end{aligned}
						`)} />
					<Card
						answer="Slope for Critical Flow: {ki(`S_c = ${sds(Sc)}\\%`)}"
						solution={kd(`
							\\begin{aligned}
								A_c &= \\left( z_L+z_R \\right)\\cdot y_c^2/2 \\\\						
								&= \\left(${zl}+${zr} \\right)\\cdot (${yc}\\, \\mathsf{m})^2/2 \\\\						
								&= ${Ac} \\, \\mathsf{m^2} \\\\
								P_c &= \\left( \\sqrt{1+z_L^2} + \\sqrt{1+z_L^2} \\right) \\\\
								&= \\left( \\sqrt{1+(${zl})^2} + \\sqrt{1+(${zr})^2} \\right) \\\\								
								&= ${Pc}\\, \\mathsf{m}\\\\
								R_c &= A_c/P_c \\\\
								&= \\frac{${Ac}\\, \\mathsf{m^2}}{${Pc}\\, \\mathsf{m}} \\\\
								&= ${Rc}\\,\\mathsf{m}\\\\\\\\

								\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
								&= \\left(\\frac{${n}\\times ${vc}\\, \\mathsf{m/s} }{ (${Rc}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
								&= ${Sc / 100} \\\\\\\\
								S_c &= ${Sc}\\% 								
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

			&.Q {
				top: 37%;
				left: 44%;
				background-color: transparent;
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
</style>
