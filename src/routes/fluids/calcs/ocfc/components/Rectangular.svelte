<script>
	import { fade } from "svelte/transition";
	import { ki, kd, fluids } from "$lib/utilities";
	// import { rect } from "$lib/rectangular";
	import Card from "./Card.svelte";
	import Intro from "./Intro.svelte";
	let typeOfChannel = "rectangular",
		specifyY = true,
		validS = true,
		extraDig = true;

	let sdigs = 3,
		wdigs = 5;

	$: sds = (num, digs = sdigs) => {
		let n = num.toString(),
			d = digs;

		if (extraDig) {			
			while (n[0] === "0" || n[0] === ".") {
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

	let den = 21;
	let num = 42;

	// variables ending in s are string inputs, bound to numerical input fields
	let bs = 3,
		ys = 1.75,
		QQs = 3.25,
		ss = 0.1,
		ns = 0.012,
		gs = 9.81;

	// inputs
	$: b = Number(sds(bs));
	$: y = Number(sds(ys));
	$: QQ = Number(sds(QQs));
	$: n = Number(sds(ns));
	$: s = Number(sds(ss));
	$: g = Number(sds(gs));
	// calculations
	$: A = sdw(b * y);
	$: WP = sdw(b + 2 * y);
	$: R = sdw(A/WP);
	$: v = sdw(fluids.getV(n, R, s));
	$: Q = sdw(A*v);
	$: E = sdw(fluids.getE(y, v, g));

	const calculate = () => {
		return 42;
	};
	const processChange = () => {
		calculate();
	};
</script>

<article>
	<section>
		<Intro {typeOfChannel} />
	</section>

	<section class="radios">
		<label class="yQlayout">
			<input type="radio" bind:group={specifyY} value={true} />
			<span class="radio__label">Specify {@html ki(`y`)}</span>
		</label>
		<label class="yQlayout">
			<input type="radio" bind:group={specifyY} value={false} />
			<span class="radio__label">Specify {@html ki(`Q`)}</span>
		</label>
	</section>

	<section class="fig">
		<div class="width75">
			<img src="/ocfc/rectangularChannelSectionQ.png" alt="rectangular channel section" />

			{#if specifyY}
				<img
					class="super"
					in:fade={{ duration: 750 }}
					out:fade={{ duration: 500 }}
					src="/ocfc/rectangularChannelSectionY.png"
					alt="rectangular channel section by depth" />
			{/if}

			<form on:submit|preventDefault={calculate}>
				<label class="b">
					{@html ki(`\\large b=`)}
					<input type="number" step="any" required bind:value={bs} />
					{@html ki(`\\textsf{m}`)}
				</label>

				{#if specifyY}
					<label class="y">
						{@html ki(`\\large y=`)}
						<input type="number" step="any" required bind:value={ys} />
						{@html ki(`\\textsf{m}`)}
					</label>
				{:else}
					<label class="Q">
						{@html ki(`\\large Q=`)}
						<input type="number" step="any" required bind:value={QQs} />
						{@html ki(`\\mathsf{m^3\\!/s}`)}
					</label>
				{/if}
			</form>
		</div>

		<form on:submit|preventDefault={calculate}>
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
		{#if specifyY}
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
                                &= ${sds(bs)}\\, \\mathsf{m} \\times ${sds(ys)}\\, \\mathsf{m} \\\\
                                &= ${A}\\, \\mathsf{m^2}
                            \\end{aligned}
                        `)} />

					<Card
						answer="Wetted Perimeter: {ki(`W\\!P = ${sds(WP)}\\, \\mathsf{m}`)}"
						solution={kd(`
                            \\begin{aligned}
                                WP &= b+2y \\\\
                                &= ${sds(bs)}\\, \\mathsf{m} + 2\\times ${sds(ys)}\\, \\mathsf{m} \\\\
                                &= ${WP}\\, \\mathsf{m}
                            \\end{aligned}
                        `)} />
					<Card
						answer="Hydraulic Radius: {ki(`R = ${sds(R)}\\, \\mathsf m`)}  "
						solution={kd(`
                            \\begin{aligned}
                                R &= A/W\\!P \\\\
                                &= ${sdw(A)}\\, \\mathsf{m^2} / ${sdw(WP)}\\, \\mathsf{m} \\\\
                                &= ${sdw(R)} \\mathsf{m}
                            \\end{aligned}
                        `)} />
					<Card
						answer="Average Flow Velocity: {ki(`v = ${sds(v)}\\, \\mathsf{m/s}`)}  "
						solution={kd(`
                            \\begin{aligned}
                               v &= \\frac 1n R^{2/3} S^{1/2} \\\\
							   &= \\frac{1}{${n}} \\left(${sdw(R)}\\right)^{2/3} \\left(${sds(s)}\\right)^{1/2} \\\\
							   &= ${sdw(v)} \\, \\mathsf{m/s}
                            \\end{aligned}
                        `)} />
					<Card
						answer="Flow Rate: {ki(`Q = ${sds(Q)}\\, \\mathsf{m^3/s}`)}  "
						solution={kd(`
                            \\begin{aligned}
                               Q &= Av \\\\
							   &= ${sdw(A)}\\, \\mathsf{m^2}\\times ${sdw(v)}\\, \\mathsf{m/s} \\\\
							   &= ${sdw(Q)} \\, \\mathsf{m^3/s}
                            \\end{aligned}
                        `)} />
					<Card
						answer="Specific Energy: {ki(`E = ${sds(E)}\\, \\mathsf{m}`)}  "
						solution={kd(`
                            \\begin{aligned}
                               Q &= Av \\\\
							   &= ${sdw(A)}\\, \\mathsf{m^2}\\times ${sdw(v)}\\, \\mathsf{m/s} \\\\
							   &= ${sdw(Q)} \\, \\mathsf{m^3/s}
                            \\end{aligned}
                        `)} />
						

				</section>
			{/if}
		{:else}
			{@html kd(`\\frac{${den}}{${num}}`)}
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
				top: 40%;
				left: 47.5%;
				background-color: #088;
			}

			&.b {
				top: 74%;
				left: 40%;
				background-color: #ccc;
			}

			&.Q {
				top: 41%;
				left: 37%;
				background-color: #088;
				padding: 0;
				color: white;
			}
		}
		.lower-inputs {
			// border: 1px solid black;
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
