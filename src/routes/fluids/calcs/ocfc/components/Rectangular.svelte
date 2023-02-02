<script>
	import { fade } from "svelte/transition";
	import { ki, kd, utils } from "$lib/utilities";
	import Intro from "./Intro.svelte";
	let typeOfChannel = "rectangular";
	let specifyY = true;

	let sdigs = 3,
		wdigs = 5;

	$: sds = (num_string) => {
		return parseFloat(num_string).toPrecision(sdigs);
	};
	$: sdw = (num_string) => {
		return parseFloat(num_string).toPrecision(wdigs);
	};

	let den = 21;
	let num = 42;

	// variables ending in s are string inputs, bound to numerical input fields
	let bs = 3,
		ys = 1.75,
		QQs = 3.25,
		ss = 0.1,
		n = 0.012,
		g = 9.81;

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
					{@html ki(`b=`)}
					<input type="number" step="any" required bind:value={bs} on:input={processChange} />
					{@html ki(`\\textsf{m}`)}
				</label>

				{#if specifyY}
					<label class="y">
						{@html ki(`y=`)}
						<input type="number" step="any" required bind:value={ys} on:input={processChange} />
						{@html ki(`\\textsf{m}`)}
					</label>
				{:else}
					<label class="Q">
						{@html ki(`Q=`)}
						<input type="number" step="any" required bind:value={QQs} on:input={processChange} />
						{@html ki(`\\mathsf{m^3\\!/s}`)}
					</label>
				{/if}
			</form>
		</div>
		
		    <form  on:submit|preventDefault={calculate}>
    			
    				<label class="slope">
    					{@html ki(`S=`)}
    					<input type="number" step="any" required bind:value={ss} on:input={processChange} />
    					{@html ki(`\\small\\%`)}
    				</label>
    
    				{#if specifyY}
    					<label class="n">
    						Manning's {@html ki(`n=`)}
    						<input type="number" step="any" required bind:value={n} on:input={processChange} />
    					</label>
    					<label class="g">
    						{@html ki(`g=`)}
    						<input type="number" step="any" required bind:value={g} on:input={calculate} />
    						{@html ki(`\\small \\mathsf{ m/s^2 }`)}
    					</label>
    				{/if}
    			
    		</form>
		
	</section>

	{@html kd(`\\frac{${num}}{${den}}`)}

	{specifyY}
	{sds(4.567)}
	{sdw(4.567)}
	<br />

	{@html ki(`${sdw(4.567)}`)}
	{@html ki(`\\mathsf{${sdw(4.567)}}`)}
	{sdw(4.567)}
</article>

<style lang="scss">
	section.fig form {
		.katex {
			color: red;
		}
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

			&.slope {
				padding: 0.25em;
				top: 92%;
				left: 0;
			}

			&.n {
				padding: 0.25em;
				top: 92%;
				left: 35%;
			}

			&.g {
				padding: 0.25em;
				top: 92%;
				right: 0;
			}
		}
	}
</style>
