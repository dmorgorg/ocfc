<script>
	import Card from "./Card.svelte";
	// import { fade } from "svelte/transition";
	import { ki, kd, fluids, utils, circ } from "$lib/utilities";

	let sdigs = 3,
		wdigs = 6,
		validS = true,
		extraDig = true,
		extraWorkingDig = true,
		initDepth = 0.5,
		initDiam = 1.5,
		error;

	const sdw = (num) => {
		return utils.sd(num, wdigs, extraWorkingDig);
	};
	const sds = (num) => {
		return utils.sd(num, sdigs, extraDig);
	};
	const inputFormat = utils.debounce((e) => {
		// if (e.target.value === "") e.target.value = sds(0);
		console.log(e.target.id);
		// if (e.target.id === "depth") {
		// ys = sds(Math.min(y, D));
		// } else if (e.target.id === "diam") {
		Ds = sds(Math.max(y, D));
		ys = sds(Math.min(y, D));
		// }
	}, 2000);

	const processChange = (e) => {
		// set y and D here to (hopefully) prevent image/null problems
		if (e.target.value === "" && e.target.id === "diam") D = Math.max(y, initDiam);
		if (e.target.value === "" && e.target.id === "depth") y = Math.min(initDepth, D);
		if (y > D) ys = Ds;
		inputFormat(e);
	};

	// variables ending in s are string inputs, bound to numerical input fields
	$: Ds = sds(initDiam);
	$: ys = sds(initDepth);
	$: ss = sds(0.1);
	$: ns = sds(0.013);
	$: gs = sds(9.81);

	$: D = Number(Ds);
	$: y = Number(ys);
	$: s = Number(ss);
</script>

<article>
	<section class="fig">
		{#if y === D}
			<img src="/ocfc/circ10.png" alt="full circular pipe" />
		{:else if y >= 0.938 * D}
			<img src="/ocfc/circMax.png" alt="max flow circular pipe" />
		{:else if y >= 0.85 * D}
			<img src="/ocfc/circ9.png" alt="90% depth circular pipe" />
		{:else if y > 0.75 * D}
			<img src="/ocfc/circ8.png" alt="80% depth circular pipe" />
		{:else if y > 0.65 * D}
			<img src="/ocfc/circ7.png" alt="70% depth circular pipe" />
		{:else if y > 0.5 * D}
			<img src="/ocfc/circ6.png" alt="60% depth circular pipe" />
		{:else if y === 0.5 * D}
			<img src="/ocfc/circ5.png" alt="50% depth circular pipe" />
		{:else if y > 0.35 * D}
			<img src="/ocfc/circ4.png" alt="40% depth circular pipe" />
		{:else if y > 0.25 * D}
			<img src="/ocfc/circ3.png" alt="30% depth circular pipe" />
		{:else if y > 0.15 * D}
			<img src="/ocfc/circ2.png" alt="20% depth circular pipe" />
		{:else if y > 0}
			<img src="/ocfc/circ1.png" alt="10% depth circular pipe" />
		{:else if y === 0}
			<img src="/ocfc/circ0.png" alt="0% depth circular pipe" />
		{/if}
		<form>
			<label class="diam">
				{@html ki(`\\large D=`)}
				<input type="number" step="any" id="diam" bind:value={Ds} on:input={processChange} />
				{@html ki(`\\textsf{m}`)}
			</label>
			<br />
			{#if D}
				<label class="y">
					{@html ki(`\\large y=`)}
					<input type="number" step="any" id="depth" bind:value={ys} on:input={processChange} />
					{@html ki(`\\textsf{m}`)}
				</label>
			{/if}
		</form>
		<form>
			<div class="lower-inputs">
				<label class="slope">
					{@html ki(`\\large S=`)}
					<input type="number" step="any" id="diam" bind:value={ss} on:input={processChange} />
					{@html ki(`\\small\\%`)}
				</label>
				<label class="n">
					Mannings {@html ki(`\\large n =`)}
					<input type="number" step="any" id="depth" bind:value={ns} on:input={processChange} />
					{@html ki(`\\mathsf{m}`)}
				</label>
				<label class="g">
					{@html ki(`\\large g=`)}
					<input type="number" step="any" id="depth" bind:value={gs} on:input={processChange} />
					{@html ki(`\\mathsf{m/s^2}`)}
				</label>
			</div>
		</form>
	</section>
</article>



Ds: {Ds}, D={D} <br /> ys: {ys}, y={y} <br />
{y / D}

<style lang="scss">
	section.fig form {
		input {
			width: 4.25rem;
			font-size: 0.9rem;
			padding-left: 0.1rem;
			padding-right: 0.1rem;
			cursor: pointer;

			&:invalid {
				color: red;
				font-weight: bold;
			}
		}

		label {
			// font-size: 90%;
			position: absolute;
			padding: 0 0.25em;

			&.y {
				padding: 0.25em;
				top: 67.5%;
				left: 6%;
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
			margin-top: -2.5em;

			label {
				position: relative;
				padding: 0 0.25em;
			}
		}
		// .red {
		// 	display: block;
		// 	border: 2px solid red;
		// }
	}
	// img {
	// 		border: 1px solid black;
	// 		padding: 0;
	// 	}
</style>
